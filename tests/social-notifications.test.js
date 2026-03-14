const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function loadSocialNotifications() {
  const source = fs.readFileSync(path.join(__dirname, "..", "public", "social-notifications.js"), "utf8");
  const context = { globalThis: {} };
  vm.createContext(context);
  vm.runInContext(source, context);
  return context.globalThis.StampbookSocialNotifications;
}

function buildPayload() {
  return {
    unread: 2,
    total: 12,
    notifications: [
      {
        id: "n1",
        type: "friend_request",
        message: "Lina sent a friend request",
        createdAt: "2026-03-14T10:00:00.000Z",
        isRead: false,
        meta: { fromUserId: "lina" }
      },
      {
        id: "n2",
        type: "post_comment",
        message: "Karim commented on your post",
        createdAt: "2026-03-14T11:00:00.000Z",
        isRead: true,
        meta: { followerId: "karim" }
      },
      {
        id: "n3",
        type: "group_post",
        message: "New post in Arab Collectors",
        createdAt: "2026-03-14T12:00:00.000Z",
        isRead: false,
        meta: { groupId: "arab-collectors" }
      }
    ]
  };
}

function options(overrides = {}) {
  return {
    notificationFilter: "all",
    notificationOffset: 0,
    notificationPageSize: 5,
    escapeHtml: value => String(value ?? ""),
    formatDate: value => String(value ?? ""),
    ...overrides
  };
}

test("renders load-more button only for all filter when total exceeds current page", () => {
  const moduleApi = loadSocialNotifications();
  const payload = buildPayload();

  const allFilter = moduleApi.renderNotificationBoardHtml(payload, options({ notificationFilter: "all" }));
  assert.match(allFilter.html, /id="notifLoadMoreBtn"/);

  const unreadFilter = moduleApi.renderNotificationBoardHtml(payload, options({ notificationFilter: "unread" }));
  assert.doesNotMatch(unreadFilter.html, /id="notifLoadMoreBtn"/);
});

test("applies unread and requests filters to notification list", () => {
  const moduleApi = loadSocialNotifications();
  const payload = buildPayload();

  const unread = moduleApi.renderNotificationBoardHtml(payload, options({ notificationFilter: "unread" }));
  assert.match(unread.html, /n1/);
  assert.match(unread.html, /n3/);
  assert.doesNotMatch(unread.html, /n2/);

  const requests = moduleApi.renderNotificationBoardHtml(payload, options({ notificationFilter: "requests" }));
  assert.match(requests.html, /n1/);
  assert.doesNotMatch(requests.html, /n2/);
  assert.doesNotMatch(requests.html, /n3/);
});

test("builds group and profile target routes from notification metadata", () => {
  const moduleApi = loadSocialNotifications();
  const payload = buildPayload();

  const rendered = moduleApi.renderNotificationBoardHtml(payload, options({ notificationFilter: "all" }));
  assert.match(rendered.html, /#group\/arab-collectors/);
  assert.match(rendered.html, /#profile\/lina/);
  assert.equal(rendered.unread, 2);
});
