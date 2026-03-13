const express = require("express");
const fs = require("fs").promises;
const fsSync = require("fs");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const wallet = require("./wallet");
const market = require("./market");
const blockchain = require("./blockchain");

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
  : ["http://localhost:8080", "http://localhost:3000", "http://localhost:10000"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  }
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, "data.json");
const COMMUNITY_FILE = process.env.COMMUNITY_FILE || path.join(__dirname, "community-posts.json");
const SOCIAL_BOOTSTRAP_FILE = process.env.SOCIAL_BOOTSTRAP_FILE || path.join(__dirname, "social-bootstrap.json");
const SOCIAL_FOLLOWS_FILE = process.env.SOCIAL_FOLLOWS_FILE || path.join(__dirname, "social-follows.json");
const SOCIAL_GROUPS_FILE = process.env.SOCIAL_GROUPS_FILE || path.join(__dirname, "social-groups.json");
const SOCIAL_FRIEND_REQUESTS_FILE = process.env.SOCIAL_FRIEND_REQUESTS_FILE || path.join(__dirname, "social-friend-requests.json");
const SOCIAL_FRIENDS_FILE = process.env.SOCIAL_FRIENDS_FILE || path.join(__dirname, "social-friends.json");
const SOCIAL_NOTIFICATIONS_FILE = process.env.SOCIAL_NOTIFICATIONS_FILE || path.join(__dirname, "social-notifications.json");
const NFT_DRAFTS_FILE = process.env.NFT_DRAFTS_FILE || path.join(__dirname, "nft-drafts.json");
const P2P_LISTINGS_FILE = process.env.P2P_LISTINGS_FILE || path.join(__dirname, "p2p-listings.json");
const UPLOAD_DIR = path.join(__dirname, "public", "uploads");
const SYNC_TOKEN = process.env.SYNC_TOKEN || "";

if (!fsSync.existsSync(UPLOAD_DIR)) {
  fsSync.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const upload = multer({
  dest: UPLOAD_DIR,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const isJpg = file.mimetype === "image/jpeg" || file.mimetype === "image/jpg";
    if (!isJpg) {
      cb(new Error("Only JPG images are allowed"));
      return;
    }
    cb(null, true);
  }
});

// === Authentication Middleware ===
function requireToken(req, res, next) {
  const auth = req.get("Authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (!SYNC_TOKEN) {
    if (process.env.NODE_ENV === "production") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.warn("SYNC_TOKEN not configured - authentication disabled (development mode)");
    return next();
  }
  if (token !== SYNC_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// === Health & Status Endpoints ===
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "Stampbook",
    version: "2.0.0"
  });
});

app.get("/api/status", (req, res) => {
  res.json({ success: true, status: "running" });
});

app.get("/api/info", (req, res) => {
  res.json({
    name: "Stampbook",
    version: "2.0.0",
    description: "Social collectibles network with wallet, NFT, and marketplace",
    endpoints: {
      wallet: "/api/wallet",
      market: "/api/market",
      blockchain: "/api/blockchain",
      token: "/api/token",
      sync: "/sync"
    }
  });
});

// === Wallet API ===
app.post("/api/wallet/create", (req, res) => {
  try {
    const { userId, userName } = req.body;
    if (!userId || !userName) return res.status(400).json({ error: "userId and userName are required" });
    const w = wallet.createWallet(userId, userName);
    res.json(w);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get("/api/wallet/:userId", (req, res) => {
  try {
    const w = wallet.getWallet(req.params.userId);
    if (!w) return res.status(404).json({ error: "Wallet not found" });
    res.json(w);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/wallet/transfer", (req, res) => {
  try {
    const { fromUserId, toUserId, amount } = req.body;
    if (!fromUserId || !toUserId || !amount) return res.status(400).json({ error: "fromUserId, toUserId, and amount are required" });
    const tx = wallet.transfer(fromUserId, toUserId, Number(amount));
    res.json(tx);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get("/api/wallet/:userId/transactions", (req, res) => {
  try {
    const txs = wallet.getTransactionHistory(req.params.userId);
    res.json(txs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/wallet/:userId/stamps", requireToken, (req, res) => {
  try {
    const stamp = req.body;
    if (!stamp || !stamp.name) return res.status(400).json({ error: "stamp name is required" });
    const w = wallet.addStamp(req.params.userId, stamp);
    res.json(w);
  } catch (e) {
    if (e.message === "Wallet not found") return res.status(404).json({ error: e.message });
    res.status(400).json({ error: e.message });
  }
});

app.get("/api/wallets", requireToken, (req, res) => {
  try {
    res.json(wallet.getAllWallets());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/wallet/:userId/topup", requireToken, (req, res) => {
  try {
    const amount = Number((req.body && req.body.amount) || 1000);
    const w = wallet.updateBalance(req.params.userId, amount);
    res.json(w);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// === Market API ===
app.get("/api/market/items", (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.sellerId) filter.sellerId = req.query.sellerId;
    if (req.query.search) filter.search = req.query.search;

    const minPrice = Number(req.query.minPrice);
    if (!Number.isNaN(minPrice)) filter.minPrice = minPrice;

    const maxPrice = Number(req.query.maxPrice);
    if (!Number.isNaN(maxPrice)) filter.maxPrice = maxPrice;

    if (req.query.sort) filter.sort = req.query.sort;

    const limit = Number(req.query.limit);
    if (Number.isInteger(limit) && limit > 0) filter.limit = limit;

    res.json(market.getAllMarketItems(filter));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/market/items", (req, res) => {
  try {
    const { sellerId, name, description, price, type, imageUrl } = req.body;
    if (!sellerId || !name) return res.status(400).json({ error: "sellerId and name are required" });
    const item = market.addMarketItem(sellerId, { name, description, price, type, imageUrl });
    res.json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get("/api/market/items/:itemId", (req, res) => {
  try {
    res.json(market.getMarketItem(req.params.itemId));
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

app.put("/api/market/items/:itemId", (req, res) => {
  try {
    const { userId, price, description, status, imageUrl } = req.body || {};
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const item = market.getMarketItem(req.params.itemId);
    if (item.sellerId !== userId) return res.status(403).json({ error: "Only the seller can update this item" });
    const updates = {};
    if (price !== undefined) updates.price = price;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (Object.keys(updates).length === 0) return res.status(400).json({ error: "No updatable fields provided" });
    res.json(market.updateMarketItem(req.params.itemId, updates));
  } catch (e) {
    if (e.message === "Market item not found") return res.status(404).json({ error: e.message });
    res.status(400).json({ error: e.message });
  }
});

app.post("/api/market/items/:itemId/buy", (req, res) => {
  try {
    const { buyerId } = req.body;
    if (!buyerId) return res.status(400).json({ error: "buyerId is required" });
    const item = market.getMarketItem(req.params.itemId);
    if (item.price > 0) {
      wallet.transfer(buyerId, item.sellerId, item.price);
    }
    const result = market.purchaseMarketItem(req.params.itemId, buyerId);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.delete("/api/market/items/:itemId", (req, res) => {
  try {
    const userId = (req.body && req.body.userId) || req.query.userId;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    res.json(market.removeMarketItem(req.params.itemId, userId));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get("/api/market/transactions", (req, res) => {
  try {
    const filter = {};
    if (req.query.buyerId) filter.buyerId = req.query.buyerId;
    if (req.query.sellerId) filter.sellerId = req.query.sellerId;
    res.json(market.getMarketTransactions(filter));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// === Token Info API ===
app.get("/api/token", (req, res) => {
  res.json({
    name: "StampCoin",
    symbol: "STP",
    totalSupply: 421000000,
    icoPrice: 1.65,
    icoUnit: "USD",
    decimals: 18,
    license: "MIT",
    website: "https://ecostamp.net",
    github: "https://github.com/zedanazad43/stp",
    contact: "stampcoin.contact@gmail.com",
    distribution: [
      { label: "Public ICO Sale",       percent: 20, amount: 84200000 },
      { label: "Ecosystem & Partners",  percent: 20, amount: 84200000 },
      { label: "Community & Rewards",   percent: 20, amount: 84200000 },
      { label: "Liquidity Pool",        percent: 15, amount: 63150000 },
      { label: "Team & Founders",       percent: 15, amount: 63150000 },
      { label: "Reserve",               percent: 10, amount: 42100000 }
    ],
    contractAddress: process.env.STP_CONTRACT_ADDRESS || "Pending mainnet deployment",
    network: "EVM-compatible"
  });
});

// === Blockchain API ===
app.get("/api/blockchain/info", (req, res) => {
  try {
    res.json(blockchain.getBlockchainInfo());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/blockchain/supply", (req, res) => {
  try {
    res.json(blockchain.getSupply());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/blockchain/mint", requireToken, (req, res) => {
  try {
    const { toAddress, amount } = req.body || {};
    if (!toAddress) return res.status(400).json({ error: "toAddress is required" });
    if (amount === undefined || amount === null) return res.status(400).json({ error: "amount is required" });
    const event = blockchain.mintTokens(toAddress, Number(amount));
    res.json(event);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get("/api/blockchain/balance/:address", (req, res) => {
  try {
    res.json(blockchain.getBalance(req.params.address));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get("/api/blockchain/mint/events", requireToken, (req, res) => {
  try {
    res.json(blockchain.getMintEvents());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// === Sync API (for todo sync) ===
async function readData() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading data file:", e.message);
    return [];
  }
}

async function writeData(todos) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2), "utf8");
    return true;
  } catch (e) {
    console.error("Write error:", e);
    return false;
  }
}

async function readJsonArray(filePath) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeJsonArray(filePath, rows) {
  await fs.writeFile(filePath, JSON.stringify(rows, null, 2), "utf8");
}

async function addSocialNotification(userId, type, message, meta = {}) {
  if (!userId || !type || !message) {
    return;
  }

  const notifications = await readJsonArray(SOCIAL_NOTIFICATIONS_FILE);
  notifications.push({
    id: `ntf_${Date.now()}_${Math.floor(Math.random() * 1e6)}`,
    userId,
    type,
    message,
    meta,
    isRead: false,
    createdAt: new Date().toISOString()
  });

  if (notifications.length > 800) {
    notifications.splice(0, notifications.length - 800);
  }

  await writeJsonArray(SOCIAL_NOTIFICATIONS_FILE, notifications);
}

function normalizeCommunityPost(post) {
  const reactions = post && typeof post.reactions === "object" && post.reactions
    ? post.reactions
    : { like: 0, love: 0, wow: 0 };
  const comments = Array.isArray(post && post.comments) ? post.comments : [];
  return {
    ...post,
    reactions: {
      like: Number(reactions.like || 0),
      love: Number(reactions.love || 0),
      wow: Number(reactions.wow || 0)
    },
    shares: Number((post && post.shares) || 0),
    comments
  };
}

function getDefaultSocialBootstrap() {
  return {
    stories: [
      { id: "st_1", name: "Lina", tag: "New Ottoman Set" },
      { id: "st_2", name: "Mazin", tag: "Auction Tonight" },
      { id: "st_3", name: "Rama", tag: "NFT Drop" },
      { id: "st_4", name: "Yousef", tag: "Rare Cover" }
    ],
    people: [
      { id: "u_1", name: "Nora Al Collector", role: "Classic Stamps" },
      { id: "u_2", name: "Kareem Chain", role: "NFT Curator" },
      { id: "u_3", name: "Sahar Philately", role: "Postal Historian" }
    ],
    trending: ["#Stampbook", "#RareStamp", "#NFTPhilately", "#P2PEscrow", "#STP"]
  };
}

// === Community Hub API ===
app.get("/api/community/posts", async (_req, res) => {
  try {
    const posts = await readJsonArray(COMMUNITY_FILE);
    const normalized = posts.map(normalizeCommunityPost);
    res.json(normalized.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/community/posts", async (req, res) => {
  try {
    const { title, body, imageUrl, authorId } = req.body || {};
    if (!title || !body) {
      return res.status(400).json({ error: "title and body are required" });
    }
    const posts = await readJsonArray(COMMUNITY_FILE);
    const post = {
      id: `post_${Date.now()}`,
      title,
      body,
      imageUrl: imageUrl || "",
      authorId: authorId || "anonymous",
      reactions: { like: 0, love: 0, wow: 0 },
      shares: 0,
      comments: [],
      createdAt: new Date().toISOString()
    };
    posts.push(post);
    await writeJsonArray(COMMUNITY_FILE, posts);
    res.json(post);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/social/bootstrap", async (_req, res) => {
  try {
    const rows = await readJsonArray(SOCIAL_BOOTSTRAP_FILE);
    if (!rows.length) {
      return res.json(getDefaultSocialBootstrap());
    }
    const first = rows[0] || {};
    res.json({
      stories: Array.isArray(first.stories) ? first.stories : [],
      people: Array.isArray(first.people) ? first.people : [],
      trending: Array.isArray(first.trending) ? first.trending : []
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/community/posts/:postId/react", async (req, res) => {
  try {
    const reactionType = (req.body && req.body.reactionType) || "like";
    const allowed = ["like", "love", "wow"];
    if (!allowed.includes(reactionType)) {
      return res.status(400).json({ error: "reactionType must be one of like, love, wow" });
    }

    const posts = await readJsonArray(COMMUNITY_FILE);
    const postIdx = posts.findIndex(post => post.id === req.params.postId);
    if (postIdx === -1) {
      return res.status(404).json({ error: "Post not found" });
    }

    const post = normalizeCommunityPost(posts[postIdx]);
    post.reactions[reactionType] += 1;
    posts[postIdx] = post;
    await writeJsonArray(COMMUNITY_FILE, posts);
    if (post.authorId && post.authorId !== (req.body && req.body.actorUserId)) {
      await addSocialNotification(
        post.authorId,
        "post_reaction",
        `Your post received a ${reactionType} reaction.`,
        { postId: post.id, reactionType }
      );
    }
    res.json(post);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/community/posts/:postId/comment", async (req, res) => {
  try {
    const { text, authorId } = req.body || {};
    if (!text) {
      return res.status(400).json({ error: "text is required" });
    }

    const posts = await readJsonArray(COMMUNITY_FILE);
    const postIdx = posts.findIndex(post => post.id === req.params.postId);
    if (postIdx === -1) {
      return res.status(404).json({ error: "Post not found" });
    }

    const post = normalizeCommunityPost(posts[postIdx]);
    post.comments.push({
      id: `c_${Date.now()}`,
      authorId: authorId || "anonymous",
      text,
      createdAt: new Date().toISOString()
    });
    if (post.comments.length > 60) {
      post.comments = post.comments.slice(post.comments.length - 60);
    }

    posts[postIdx] = post;
    await writeJsonArray(COMMUNITY_FILE, posts);
    if (post.authorId && post.authorId !== (authorId || "anonymous")) {
      await addSocialNotification(
        post.authorId,
        "post_comment",
        `${authorId || "A collector"} commented on your post.`,
        { postId: post.id }
      );
    }
    res.json(post);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/community/posts/:postId/share", async (req, res) => {
  try {
    const posts = await readJsonArray(COMMUNITY_FILE);
    const postIdx = posts.findIndex(post => post.id === req.params.postId);
    if (postIdx === -1) {
      return res.status(404).json({ error: "Post not found" });
    }

    const post = normalizeCommunityPost(posts[postIdx]);
    post.shares += 1;
    posts[postIdx] = post;
    await writeJsonArray(COMMUNITY_FILE, posts);
    if (post.authorId) {
      await addSocialNotification(
        post.authorId,
        "post_share",
        "Your post was shared in the community timeline.",
        { postId: post.id }
      );
    }
    res.json(post);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/social/follow", async (req, res) => {
  try {
    const { followerId, targetId } = req.body || {};
    if (!followerId || !targetId) {
      return res.status(400).json({ error: "followerId and targetId are required" });
    }
    if (followerId === targetId) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    const rows = await readJsonArray(SOCIAL_FOLLOWS_FILE);
    const exists = rows.some(row => row.followerId === followerId && row.targetId === targetId);
    if (!exists) {
      rows.push({
        id: `follow_${Date.now()}`,
        followerId,
        targetId,
        createdAt: new Date().toISOString()
      });
      await writeJsonArray(SOCIAL_FOLLOWS_FILE, rows);
      await addSocialNotification(
        targetId,
        "new_follower",
        `${followerId} started following you.`,
        { followerId }
      );
    }
    res.json({ ok: true, followerId, targetId, following: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/social/following/:userId", async (req, res) => {
  try {
    const rows = await readJsonArray(SOCIAL_FOLLOWS_FILE);
    const targets = rows
      .filter(row => row.followerId === req.params.userId)
      .map(row => row.targetId);
    res.json({ userId: req.params.userId, following: targets });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/social/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = (await readJsonArray(COMMUNITY_FILE)).map(normalizeCommunityPost);
    const follows = await readJsonArray(SOCIAL_FOLLOWS_FILE);
    const friends = await readJsonArray(SOCIAL_FRIENDS_FILE);
    const groups = await readJsonArray(SOCIAL_GROUPS_FILE);

    const postsByUser = posts.filter(post => post.authorId === userId);
    const followers = follows.filter(row => row.targetId === userId).length;
    const following = follows.filter(row => row.followerId === userId).length;
    const friendsCount = friends.filter(row => row.userA === userId || row.userB === userId).length;
    const groupsCount = groups.filter(group => Array.isArray(group.members) && group.members.includes(userId)).length;
    const totalReactions = postsByUser.reduce((sum, post) => {
      return sum + Number(post.reactions.like || 0) + Number(post.reactions.love || 0) + Number(post.reactions.wow || 0);
    }, 0);

    res.json({
      userId,
      stats: {
        posts: postsByUser.length,
        followers,
        following,
        friends: friendsCount,
        groups: groupsCount,
        totalReactions
      },
      latestPosts: postsByUser
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/social/groups", async (_req, res) => {
  try {
    const groups = await readJsonArray(SOCIAL_GROUPS_FILE);
    res.json(groups.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/social/groups/:groupId", async (req, res) => {
  try {
    const groups = await readJsonArray(SOCIAL_GROUPS_FILE);
    const group = groups.find(row => row.id === req.params.groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    group.posts = Array.isArray(group.posts) ? group.posts : [];
    group.members = Array.isArray(group.members) ? group.members : [];
    group.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(group);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/social/groups", async (req, res) => {
  try {
    const { name, about, creatorId } = req.body || {};
    if (!name || !about || !creatorId) {
      return res.status(400).json({ error: "name, about, and creatorId are required" });
    }

    const groups = await readJsonArray(SOCIAL_GROUPS_FILE);
    const group = {
      id: `grp_${Date.now()}`,
      name,
      about,
      creatorId,
      members: [creatorId],
      posts: [],
      createdAt: new Date().toISOString()
    };
    groups.push(group);
    await writeJsonArray(SOCIAL_GROUPS_FILE, groups);
    res.json(group);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/social/groups/:groupId/join", async (req, res) => {
  try {
    const { userId } = req.body || {};
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    const groups = await readJsonArray(SOCIAL_GROUPS_FILE);
    const idx = groups.findIndex(group => group.id === req.params.groupId);
    if (idx === -1) {
      return res.status(404).json({ error: "Group not found" });
    }

    const group = groups[idx];
    group.members = Array.isArray(group.members) ? group.members : [];
    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await addSocialNotification(
        group.creatorId,
        "group_member_joined",
        `${userId} joined ${group.name}.`,
        { groupId: group.id, userId }
      );
    }
    groups[idx] = group;
    await writeJsonArray(SOCIAL_GROUPS_FILE, groups);
    res.json(group);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/social/groups/:groupId/posts", async (req, res) => {
  try {
    const { authorId, body } = req.body || {};
    if (!authorId || !body) {
      return res.status(400).json({ error: "authorId and body are required" });
    }

    const groups = await readJsonArray(SOCIAL_GROUPS_FILE);
    const idx = groups.findIndex(group => group.id === req.params.groupId);
    if (idx === -1) {
      return res.status(404).json({ error: "Group not found" });
    }

    const group = groups[idx];
    group.posts = Array.isArray(group.posts) ? group.posts : [];
    group.posts.push({
      id: `gp_${Date.now()}`,
      authorId,
      body,
      createdAt: new Date().toISOString()
    });
    groups[idx] = group;
    await writeJsonArray(SOCIAL_GROUPS_FILE, groups);
    const memberTargets = (group.members || []).filter(memberId => memberId !== authorId);
    await Promise.all(memberTargets.map(memberId =>
      addSocialNotification(
        memberId,
        "group_post",
        `${authorId} posted in ${group.name}.`,
        { groupId: group.id }
      )
    ));
    res.json(group.posts[group.posts.length - 1]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/social/friends/request", async (req, res) => {
  try {
    const { fromUserId, toUserId } = req.body || {};
    if (!fromUserId || !toUserId) {
      return res.status(400).json({ error: "fromUserId and toUserId are required" });
    }
    if (fromUserId === toUserId) {
      return res.status(400).json({ error: "Cannot send request to yourself" });
    }

    const requests = await readJsonArray(SOCIAL_FRIEND_REQUESTS_FILE);
    const friends = await readJsonArray(SOCIAL_FRIENDS_FILE);

    const alreadyFriends = friends.some(row =>
      (row.userA === fromUserId && row.userB === toUserId) ||
      (row.userA === toUserId && row.userB === fromUserId)
    );
    if (alreadyFriends) {
      return res.status(409).json({ error: "Users are already friends" });
    }

    const duplicate = requests.find(row =>
      row.status === "pending" && (
        (row.fromUserId === fromUserId && row.toUserId === toUserId) ||
        (row.fromUserId === toUserId && row.toUserId === fromUserId)
      )
    );
    if (duplicate) {
      return res.status(409).json({ error: "A pending request already exists" });
    }

    const requestRow = {
      id: `fr_${Date.now()}`,
      fromUserId,
      toUserId,
      status: "pending",
      createdAt: new Date().toISOString(),
      respondedAt: null
    };
    requests.push(requestRow);
    await writeJsonArray(SOCIAL_FRIEND_REQUESTS_FILE, requests);
    await addSocialNotification(
      toUserId,
      "friend_request",
      `${fromUserId} sent you a friend request.`,
      { requestId: requestRow.id, fromUserId }
    );
    res.json(requestRow);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/social/friends/respond", async (req, res) => {
  try {
    const { requestId, actorUserId, action } = req.body || {};
    if (!requestId || !actorUserId || !action) {
      return res.status(400).json({ error: "requestId, actorUserId, and action are required" });
    }
    if (!["accept", "reject"].includes(action)) {
      return res.status(400).json({ error: "action must be accept or reject" });
    }

    const requests = await readJsonArray(SOCIAL_FRIEND_REQUESTS_FILE);
    const idx = requests.findIndex(row => row.id === requestId && row.status === "pending");
    if (idx === -1) {
      return res.status(404).json({ error: "Pending request not found" });
    }

    const row = requests[idx];
    if (row.toUserId !== actorUserId) {
      return res.status(403).json({ error: "Only target user can respond" });
    }

    row.status = action === "accept" ? "accepted" : "rejected";
    row.respondedAt = new Date().toISOString();
    requests[idx] = row;
    await writeJsonArray(SOCIAL_FRIEND_REQUESTS_FILE, requests);

    if (action === "accept") {
      const friends = await readJsonArray(SOCIAL_FRIENDS_FILE);
      const userA = [row.fromUserId, row.toUserId].sort()[0];
      const userB = [row.fromUserId, row.toUserId].sort()[1];
      const exists = friends.some(item => item.userA === userA && item.userB === userB);
      if (!exists) {
        friends.push({ id: `f_${Date.now()}`, userA, userB, createdAt: new Date().toISOString() });
        await writeJsonArray(SOCIAL_FRIENDS_FILE, friends);
      }
    }

    await addSocialNotification(
      row.fromUserId,
      "friend_request_response",
      `${actorUserId} ${action === "accept" ? "accepted" : "rejected"} your friend request.`,
      { requestId: row.id, action }
    );

    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/social/friends/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const requests = await readJsonArray(SOCIAL_FRIEND_REQUESTS_FILE);
    const friends = await readJsonArray(SOCIAL_FRIENDS_FILE);

    const incoming = requests.filter(row => row.toUserId === userId && row.status === "pending");
    const outgoing = requests.filter(row => row.fromUserId === userId && row.status === "pending");
    const connected = friends
      .filter(row => row.userA === userId || row.userB === userId)
      .map(row => (row.userA === userId ? row.userB : row.userA));

    res.json({ userId, incoming, outgoing, friends: connected });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/social/notifications/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const limit = Number(req.query.limit || 20);
    const notifications = await readJsonArray(SOCIAL_NOTIFICATIONS_FILE);
    const userNotifications = notifications
      .filter(row => row.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 20;
    const rows = userNotifications.slice(0, safeLimit);
    const unread = userNotifications.filter(row => !row.isRead).length;
    res.json({ userId, unread, notifications: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/social/notifications/read", async (req, res) => {
  try {
    const { userId, notificationIds } = req.body || {};
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const notifications = await readJsonArray(SOCIAL_NOTIFICATIONS_FILE);
    const targetIds = Array.isArray(notificationIds) ? new Set(notificationIds) : null;
    let marked = 0;

    for (const row of notifications) {
      if (row.userId !== userId) {
        continue;
      }
      if (targetIds && !targetIds.has(row.id)) {
        continue;
      }
      if (!row.isRead) {
        row.isRead = true;
        marked += 1;
      }
    }

    await writeJsonArray(SOCIAL_NOTIFICATIONS_FILE, notifications);
    res.json({ ok: true, userId, marked });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// === NFT Categories + Mint Draft API ===
app.get("/api/nft/categories", (_req, res) => {
  res.json([
    { id: "PH-001", name: "Penny Black Heritage", floorPriceUsd: 220 },
    { id: "BM-019", name: "Blue Mauritius Legacy", floorPriceUsd: 680 },
    { id: "IJ-024", name: "Inverted Jenny Classics", floorPriceUsd: 390 },
    { id: "MAP-311", name: "Modern Arab Philately", floorPriceUsd: 170 }
  ]);
});

app.get("/api/nft/mint-drafts", async (_req, res) => {
  try {
    const drafts = await readJsonArray(NFT_DRAFTS_FILE);
    res.json(drafts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/nft/mint-drafts", upload.single("stampImage"), async (req, res) => {
  try {
    const { ownerId, stampTitle, feeCurrency, feeAmount } = req.body || {};
    if (!ownerId || !stampTitle || !feeCurrency || feeAmount === undefined) {
      return res.status(400).json({ error: "ownerId, stampTitle, feeCurrency, and feeAmount are required" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "JPG image is required" });
    }

    const amount = Number(feeAmount);
    const userShare = Number((amount * 0.85).toFixed(6));
    const platformShare = Number((amount * 0.15).toFixed(6));
    const publicImagePath = `/uploads/${req.file.filename}`;

    const drafts = await readJsonArray(NFT_DRAFTS_FILE);
    const draft = {
      id: `draft_${Date.now()}`,
      ownerId,
      stampTitle,
      feeCurrency,
      feeAmount: amount,
      split: {
        user: userShare,
        platform: platformShare,
        userPercent: 85,
        platformPercent: 15
      },
      imagePath: publicImagePath,
      fileName: req.file.originalname,
      web3Status: "ready_for_mint",
      createdAt: new Date().toISOString()
    };
    drafts.push(draft);
    await writeJsonArray(NFT_DRAFTS_FILE, drafts);
    res.json(draft);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// === P2P Listings API ===
app.get("/api/p2p/listings", async (_req, res) => {
  try {
    const listings = await readJsonArray(P2P_LISTINGS_FILE);
    res.json(listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/p2p/listings", async (req, res) => {
  try {
    const { sellerId, stampDetails, askPriceUsd } = req.body || {};
    if (!sellerId || !stampDetails || !askPriceUsd) {
      return res.status(400).json({ error: "sellerId, stampDetails, and askPriceUsd are required" });
    }
    const price = Number(askPriceUsd);
    const platformFeeUsd = Number((price * 0.035).toFixed(2));
    const sellerNetUsd = Number((price - platformFeeUsd).toFixed(2));

    const listings = await readJsonArray(P2P_LISTINGS_FILE);
    const row = {
      id: `p2p_${Date.now()}`,
      sellerId,
      stampDetails,
      askPriceUsd: price,
      platformFeeUsd,
      sellerNetUsd,
      escrowStatus: "open",
      createdAt: new Date().toISOString()
    };
    listings.push(row);
    await writeJsonArray(P2P_LISTINGS_FILE, listings);
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// === Web3 API ===
app.get("/api/web3/config", (_req, res) => {
  res.json({
    chainId: process.env.WEB3_CHAIN_ID || "0xaa36a7",
    networkName: process.env.WEB3_NETWORK || "sepolia",
    rpcUrl: process.env.WEB3_RPC_URL || "https://rpc.sepolia.org",
    stcContractAddress: process.env.STP_CONTRACT_ADDRESS || "0x8A63eA3D5D8D0F7A9C09F9e6f8c5B18F4c4d1A21",
    nftContractAddress: process.env.STC_NFT_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
    explorerBase: process.env.WEB3_EXPLORER || "https://sepolia.etherscan.io"
  });
});

app.post("/api/web3/quote", (req, res) => {
  const amount = Number((req.body && req.body.amount) || 0);
  const feeRate = 0.015;
  const estimatedFee = Number((amount * feeRate).toFixed(6));
  res.json({
    amount,
    feeRate,
    estimatedFee,
    totalWithFee: Number((amount + estimatedFee).toFixed(6))
  });
});

app.get("/sync", requireToken, async (req, res) => {
  const todos = await readData();
  res.json({ todos });
});

app.post("/sync", requireToken, async (req, res) => {
  const payload = req.body;
  if (!payload || !Array.isArray(payload.todos)) {
    return res.status(400).json({ error: "Invalid payload, expected { todos: [...] }" });
  }
  const ok = await writeData(payload.todos);
  if (!ok) return res.status(500).json({ error: "Failed to store data" });
  res.json({ ok: true });
});

// === SPA Fallback ===
app.get("*", (req, res) => {
  const indexPath = path.join(__dirname, "public", "index.html");
  res.sendFile(indexPath);
});

// === Start Server ===
function startServer(port = process.env.PORT || 8080) {
  const server = app.listen(port, "0.0.0.0", () => {
    const resolvedPort = server.address() && typeof server.address() === "object"
      ? server.address().port
      : port;
    console.log(`✓ Stampbook server running on port ${resolvedPort}`);
    console.log(`✓ API docs available at: http://localhost:${resolvedPort}/api/info`);
    console.log(`✓ Health check: http://localhost:${resolvedPort}/health`);
  });
  return server;
}

if (require.main === module) {
  startServer();
}

module.exports = {
  app,
  startServer
};
