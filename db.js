import Database from "better-sqlite3";

export const db = new Database("database.db");

db.exec(`
CREATE TABLE IF NOT EXISTS allowed_subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_pattern TEXT NOT NULL,
  match_type TEXT DEFAULT 'CONTAINS',
  enabled INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS inbox_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  gmail_message_id TEXT UNIQUE,
  from_email TEXT,
  to_email TEXT,
  subject TEXT,
  body_html TEXT,
  received_at TEXT,
  expires_at TEXT
);

CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
);
`);

const exists = db.prepare("SELECT 1 FROM admin_users LIMIT 1").get();
if (!exists) {
  db.prepare("INSERT INTO admin_users (username, password) VALUES (?,?)")
    .run("admin", "123456");
}
