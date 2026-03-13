const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { once } = require("node:events");

const FILE_KEYS = [
  "DATA_FILE",
  "COMMUNITY_FILE",
  "SOCIAL_BOOTSTRAP_FILE",
  "SOCIAL_FOLLOWS_FILE",
  "SOCIAL_GROUPS_FILE",
  "SOCIAL_FRIEND_REQUESTS_FILE",
  "SOCIAL_FRIENDS_FILE",
  "SOCIAL_NOTIFICATIONS_FILE",
  "NFT_DRAFTS_FILE",
  "P2P_LISTINGS_FILE"
];

const originalEnv = {};
for (const key of FILE_KEYS) {
  originalEnv[key] = process.env[key];
}

let tempDir;
let server;
let baseUrl;

async function writeJson(filePath, value) {
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), "utf8");
}

async function requestJson(pathname, options = {}) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const payload = await response.json();
  if (!response.ok) {
    const message = payload && payload.error ? payload.error : `Request failed: ${response.status}`;
    throw new Error(message);
  }
  return payload;
}

test.before(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "stampbook-social-"));

  for (const key of FILE_KEYS) {
    const fileName = `${key.toLowerCase()}.json`;
    const filePath = path.join(tempDir, fileName);
    process.env[key] = filePath;
    await writeJson(filePath, []);
  }

  delete require.cache[require.resolve("../server")];
  const { startServer } = require("../server");
  server = startServer(0);
  await once(server, "listening");
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

test.after(async () => {
  if (server) {
    await new Promise(resolve => server.close(resolve));
  }

  for (const key of FILE_KEYS) {
    if (originalEnv[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = originalEnv[key];
    }
  }

  if (tempDir) {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("creates and reads group timeline details", async () => {
  const group = await requestJson("/api/social/groups", {
    method: "POST",
    body: JSON.stringify({
      name: "Arab Stamp Collectors",
      about: "History and high-value postal collectibles",
      creatorId: "nora"
    })
  });

  await requestJson(`/api/social/groups/${group.id}/join`, {
    method: "POST",
    body: JSON.stringify({ userId: "karim" })
  });

  const post = await requestJson(`/api/social/groups/${group.id}/posts`, {
    method: "POST",
    body: JSON.stringify({ authorId: "nora", body: "Weekend auction shortlist is now live." })
  });

  const detail = await requestJson(`/api/social/groups/${group.id}`);
  assert.equal(detail.id, group.id);
  assert.equal(detail.members.includes("karim"), true);
  assert.equal(Array.isArray(detail.posts), true);
  assert.equal(detail.posts[0].id, post.id);
});

test("friend request flow generates notifications and connection", async () => {
  const request = await requestJson("/api/social/friends/request", {
    method: "POST",
    body: JSON.stringify({ fromUserId: "lina", toUserId: "yousef" })
  });

  const beforeResponse = await requestJson("/api/social/notifications/yousef");
  assert.equal(beforeResponse.unread >= 1, true);

  const response = await requestJson("/api/social/friends/respond", {
    method: "POST",
    body: JSON.stringify({ requestId: request.id, actorUserId: "yousef", action: "accept" })
  });
  assert.equal(response.status, "accepted");

  const friends = await requestJson("/api/social/friends/lina");
  assert.equal(friends.friends.includes("yousef"), true);

  const sourceNotifications = await requestJson("/api/social/notifications/lina");
  assert.equal(sourceNotifications.unread >= 1, true);
});

test("profile stats reflect post interactions and mark-read clears unread count", async () => {
  const post = await requestJson("/api/community/posts", {
    method: "POST",
    body: JSON.stringify({
      title: "Collection update",
      body: "Added two Ottoman-era cancellation marks.",
      authorId: "collector-pro"
    })
  });

  await requestJson(`/api/community/posts/${post.id}/react`, {
    method: "POST",
    body: JSON.stringify({ reactionType: "like", actorUserId: "sahar" })
  });

  await requestJson(`/api/community/posts/${post.id}/comment`, {
    method: "POST",
    body: JSON.stringify({ text: "Excellent provenance notes.", authorId: "sahar" })
  });

  await requestJson(`/api/community/posts/${post.id}/share`, {
    method: "POST",
    body: JSON.stringify({ actorUserId: "sahar" })
  });

  const profile = await requestJson("/api/social/profile/collector-pro");
  assert.equal(profile.stats.posts, 1);
  assert.equal(profile.stats.totalReactions >= 1, true);

  const notificationsBefore = await requestJson("/api/social/notifications/collector-pro");
  assert.equal(notificationsBefore.unread >= 1, true);

  await requestJson("/api/social/notifications/read", {
    method: "POST",
    body: JSON.stringify({ userId: "collector-pro" })
  });

  const notificationsAfter = await requestJson("/api/social/notifications/collector-pro");
  assert.equal(notificationsAfter.unread, 0);
});
