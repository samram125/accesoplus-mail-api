import cron from "node-cron";
import { db } from "./db.js";

export function startCleanup() {
  cron.schedule("* * * * *", () => {
    db.prepare("DELETE FROM inbox_messages WHERE expires_at < datetime('now')").run();
  });
}
