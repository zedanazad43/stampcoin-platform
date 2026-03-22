const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function createClassList() {
  const classes = new Set();
  return {
    add(...names) {
      names.forEach(name => classes.add(name));
    },
    remove(...names) {
      names.forEach(name => classes.delete(name));
    },
    toggle(name, force) {
      if (force === undefined) {
        if (classes.has(name)) {
          classes.delete(name);
          return false;
        }
        classes.add(name);
        return true;
      }
      if (force) {
        classes.add(name);
        return true;
      }
      classes.delete(name);
      return false;
    },
    contains(name) {
      return classes.has(name);
    }
  };
}

function createElement(attributes = {}) {
  const values = { ...attributes };
  return {
    hidden: false,
    innerHTML: "",
    textContent: "",
    classList: createClassList(),
    getAttribute(name) {
      return values[name] || "";
    },
    setAttribute(name, value) {
      values[name] = String(value);
    },
    removeAttribute(name) {
      delete values[name];
    }
  };
}

function createEnvironment() {
  const elements = {
    "stampbook-social": createElement(),
    socialProfileView: createElement(),
    socialGroupView: createElement(),
    profileViewTitle: createElement(),
    profileTimelineStats: createElement(),
    profileTimelinePosts: createElement(),
    groupViewTitle: createElement(),
    groupTimelineMeta: createElement(),
    groupTimelinePosts: createElement()
  };

  const tabs = [
    createElement({ "data-nav-target": "#hero" }),
    createElement({ "data-nav-target": "#stampbook-social" })
  ];

  const listeners = {};
  let intervalCallback = null;
  let intervalMs = 0;

  const document = {
    hidden: false,
    getElementById(id) {
      return elements[id] || null;
    },
    querySelectorAll(selector) {
      if (selector === ".topnav .nav-tab") {
        return tabs;
      }
      return [];
    }
  };

  const window = {
    location: { hash: "#stampbook-social" },
    addEventListener(name, callback) {
      listeners[name] = callback;
    },
    setInterval(callback, ms) {
      intervalCallback = callback;
      intervalMs = ms;
      return 77;
    },
    setTimeout(callback) {
      callback();
      return 1;
    }
  };

  return {
    document,
    elements,
    listeners,
    runInterval() {
      if (intervalCallback) {
        intervalCallback();
      }
    },
    window,
    getIntervalMs() {
      return intervalMs;
    }
  };
}

function loadSocialCore(environment) {
  const source = fs.readFileSync(path.join(__dirname, "..", "public", "social-core.js"), "utf8");
  const context = {
    document: environment.document,
    globalThis: {},
    localStorage: {
      getItem() {
        return null;
      },
      setItem() {}
    },
    requestAnimationFrame(callback) {
      callback();
    },
    window: environment.window
  };
  vm.createContext(context);
  vm.runInContext(source, context);
  return context.globalThis.StampbookSocialCore;
}

function createRuntime(overrides = {}) {
  const environment = createEnvironment();
  const socialCore = loadSocialCore(environment);
  const renderedNotifications = [];
  const requestLog = [];
  const runtime = socialCore.createSocialRuntime({
    requestJson: async url => {
      requestLog.push(url);
      if (url.includes("/notifications/")) {
        return { unread: 1, total: 1, notifications: [{ id: "n1", isRead: false }] };
      }
      if (url.includes("/profile/")) {
        return {
          userId: "collector-pro",
          stats: { followers: 8 },
          latestPosts: [{ title: "Profile post", body: "Body", createdAt: "2026-03-14T00:00:00.000Z" }]
        };
      }
      if (url.includes("/groups/")) {
        return {
          id: "arab-collectors",
          name: "Arab Collectors",
          about: "Regional stamp circle",
          members: ["lina", "karim"],
          posts: [{ authorId: "lina", body: "Welcome", createdAt: "2026-03-14T00:00:00.000Z" }]
        };
      }
      if (url === "api/social/groups") {
        return [{ id: "arab-collectors", name: "Arab Collectors" }];
      }
      if (url.includes("/friends/")) {
        return { incoming: [], outgoing: [], friends: [{ userId: "lina" }] };
      }
      return [];
    },
    escapeHtml: value => String(value ?? ""),
    formatDate: value => String(value ?? ""),
    socialState: {
      normalizeTopNavHash: hash => hash.startsWith("#profile/") || hash.startsWith("#group/") ? "#stampbook-social" : hash,
      parseSocialRoute: hash => {
        if (hash.startsWith("#profile/")) {
          return { view: "profile", value: hash.replace("#profile/", "") };
        }
        if (hash.startsWith("#group/")) {
          return { view: "group", value: hash.replace("#group/", "") };
        }
        return { view: "feed", value: "" };
      }
    },
    getSelectedGroupId: () => "arab-collectors",
    loadSocialBootstrap() {},
    loadCommunityPosts() {},
    renderGroupsList() {},
    renderFriendsBoard() {},
    renderNotificationBoard(payload, options) {
      renderedNotifications.push({ payload, options });
    },
    getActiveUserId: () => "collector-pro",
    setTheme() {},
    setCompactMode() {},
    setLeftRailCollapsed() {},
    compactModeStorageKey: "compact-mode",
    leftRailStorageKey: "left-rail",
    notificationPageSize: 10,
    initialNotificationFilter: "all",
    initialNotificationCache: { unread: 0, total: 0, notifications: [] },
    notificationPollIntervalMs: 30000,
    ...overrides
  });

  return { environment, renderedNotifications, requestLog, runtime };
}

test("initializes social runtime and only polls notifications when visible", async () => {
  let bootstrapCalls = 0;
  let communityCalls = 0;
  const { environment, requestLog, runtime } = createRuntime({
    loadSocialBootstrap() {
      bootstrapCalls += 1;
    },
    loadCommunityPosts() {
      communityCalls += 1;
    }
  });

  const timerId = runtime.initializeSocialExperience();
  await Promise.resolve();

  assert.equal(timerId, 77);
  assert.equal(bootstrapCalls, 1);
  assert.equal(communityCalls, 1);
  assert.equal(environment.getIntervalMs(), 30000);
  assert.equal(typeof environment.listeners.hashchange, "function");
  assert.equal(requestLog.filter(url => url.includes("/notifications/")).length, 1);

  environment.runInterval();
  await Promise.resolve();
  assert.equal(requestLog.filter(url => url.includes("/notifications/")).length, 2);

  environment.document.hidden = true;
  environment.runInterval();
  await Promise.resolve();
  assert.equal(requestLog.filter(url => url.includes("/notifications/")).length, 2);
});

test("merges appended notification pages without duplicates", async () => {
  const responses = [
    { unread: 2, total: 12, notifications: [{ id: "n1", isRead: false }, { id: "n2", isRead: false }] },
    { unread: 2, total: 12, notifications: [{ id: "n2", isRead: false }, { id: "n3", isRead: true }] }
  ];
  const { renderedNotifications, runtime } = createRuntime({
    requestJson: async url => {
      if (url.includes("offset=10")) {
        return responses[1];
      }
      return responses[0];
    }
  });

  await runtime.loadNotifications();
  runtime.setNotificationOffset(10);
  await runtime.loadNotifications(true);

  const merged = runtime.getNotificationCache();
  assert.equal(merged.notifications.map(row => row.id).join(","), "n1,n2,n3");
  assert.equal(renderedNotifications.at(-1).options.notificationOffset, 10);
});

test("handles profile and group routes and switches visible views", async () => {
  const { environment, runtime } = createRuntime();

  environment.window.location.hash = "#profile/collector-pro";
  await runtime.handleSocialRoute();
  assert.equal(environment.elements.profileViewTitle.textContent, "Profile: collector-pro");
  assert.equal(environment.elements.socialProfileView.hidden, false);
  assert.equal(environment.elements["stampbook-social"].hidden, true);

  environment.window.location.hash = "#group/arab-collectors";
  await runtime.handleSocialRoute();
  assert.equal(environment.elements.groupViewTitle.textContent, "Group: Arab Collectors");
  assert.equal(environment.elements.socialGroupView.hidden, false);
  assert.equal(environment.elements.socialProfileView.hidden, true);
});
