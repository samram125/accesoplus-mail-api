import express from "express";
import cors from "cors";
import { db } from "./db.js";
import { startCleanup } from "./cleanup.js";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

startCleanup();

app.get("/api/inbox", (req, res) => {
  const email = (req.query.email || "").toString().trim().toLowerCase();
  if (!email) return res.status(400).json({ error: "Email requerido" });

  const message = db.prepare(`
    SELECT * FROM inbox_messages
    WHERE to_email = ? AND expires_at >= datetime('now')
    ORDER BY received_at DESC
    LIMIT 1
  `).get(email);

  res.json({ message: message || null });
});

app.get("/api/admin/subjects", (req, res) => {
  const rows = db.prepare(`
    SELECT id, subject_pattern, match_type, enabled, created_at
    FROM allowed_subjects
    ORDER BY id DESC
  `).all();
  res.json(rows);
});

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  const user = db.prepare(`
    SELECT id FROM admin_users
    WHERE username = ? AND password = ?
  `).get(username, password);

  if (!user) return res.status(401).json({ ok: false });
  res.json({ ok: true });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("API running on port", PORT));
