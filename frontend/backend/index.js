// backend/index.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, "data.db");

// ---------- simple file-backed storage ----------
let data = { users: [], moods: [], health: [] };
function loadData() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, "utf8");
      const parsed = raw ? JSON.parse(raw) : {};
      data = {
        users: Array.isArray(parsed.users) ? parsed.users : [],
        moods: Array.isArray(parsed.moods) ? parsed.moods : [],
        health: Array.isArray(parsed.health) ? parsed.health : [],
      };
    } else {
      // create initial file
      saveData(true);
    }
  } catch (err) {
    console.error("Failed to load data.db:", err);
    data = { users: [], moods: [], health: [] };
  }
}

let saveTimeout = null;
function saveDataDebounced(force = false) {
  // debounce to avoid frequent writes
  if (saveTimeout && !force) clearTimeout(saveTimeout);
  const write = () => {
    try {
      const tmp = DB_PATH + ".tmp";
      fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf8");
      fs.renameSync(tmp, DB_PATH);
      // console.log("Saved data.db");
    } catch (err) {
      console.error("Failed to save data.db:", err);
    }
  };
  if (force) {
    write();
    return;
  }
  saveTimeout = setTimeout(write, 200); // 200ms debounce
}

function saveData(force = false) {
  saveDataDebounced(force);
}

// load on startup
loadData();

// ---------- middleware ----------
app.use(express.json());
app.use((req, res, next) => {
  // lightweight logging
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// allow frontend origin in dev, but also allow no-origin (curl/postman)
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
app.use(cors({
  origin: (origin, cb) => {
    // allow no-origin (curl/postman), or the configured frontend origin
    if (!origin || origin === FRONTEND_ORIGIN) cb(null, true);
    else cb(null, false);
  }
}));

// ---------- routes ----------
app.get("/", (req, res) => res.send("Backend is running!"));

// register
app.post("/api/auth/register", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "email/password required" });
  if (data.users.find(u => u.email === email)) return res.status(409).json({ error: "user exists" });
  const user = { id: Date.now().toString(), email, password };
  data.users.push(user);
  saveData();
  res.json({ ok: true, user: { id: user.id, email: user.email } });
});

// login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  const user = data.users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: "invalid credentials" });
  res.json({ ok: true, user: { id: user.id, email: user.email } });
});

// get moods
app.get("/api/moods", (req, res) => {
  res.json(data.moods);
});

// post mood
app.post("/api/moods", (req, res) => {
  const { mood, note, userId } = req.body || {};
  if (!mood) return res.status(400).json({ error: "mood required" });
  const item = {
    id: Date.now().toString(),
    mood,
    note: note || "",
    userId: userId || null,
    createdAt: new Date().toISOString()
  };
  data.moods.unshift(item); // newest first
  saveData();
  res.json(item);
});

// GET health entries
app.get("/api/health", (req, res) => {
  res.json(Array.isArray(data.health) ? data.health : []);
});

// POST /api/health — save health entries
app.post("/api/health", (req, res) => {
  const { date, steps, sleep, note, userId } = req.body || {};
  // require at least steps or sleep (basic validation)
  if ((typeof steps === "undefined" || steps === null || steps === "") &&
      (typeof sleep === "undefined" || sleep === null || sleep === "")) {
    return res.status(400).json({ error: "at least one of steps or sleep is required" });
  }

  const entry = {
    id: Date.now().toString(),
    date: date || new Date().toISOString(),
    steps: (steps === "" || steps === undefined || steps === null) ? 0 : Number(steps),
    sleep: (sleep === "" || sleep === undefined || sleep === null) ? null : Number(sleep),
    note: note || "",
    userId: userId || null,
    createdAt: new Date().toISOString()
  };

  if (!Array.isArray(data.health)) data.health = [];
  data.health.unshift(entry);
  saveData();
  res.json(entry);
});

// catch-all for unknown api routes -> JSON 404 (prevents HTML error pages)
app.use("/api", (req, res) => {
  res.status(404).json({ error: `Unknown API route ${req.method} ${req.originalUrl}` });
});

// fallback (non-API) - keep simple
app.use((req, res) => {
  res.status(404).send("Not found");
});

// ---------- start ----------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
