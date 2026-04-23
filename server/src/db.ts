import { createClient, Client } from '@libsql/client';
import path from 'path';
import fs from 'fs';
 
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_PATH  = `file:${path.join(DATA_DIR, 'dietetics.db')}`;
 
let client: Client;
 
export function getDB(): Client {
  if (!client) {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    client = createClient({ url: DB_PATH });
  }
  return client;
}
 
export async function initDB(): Promise<void> {
  const db = getDB();
 
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      email         TEXT    UNIQUE NOT NULL,
      password_hash TEXT    NOT NULL,
      name          TEXT    NOT NULL,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
    );
 
    CREATE TABLE IF NOT EXISTS foods (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      name              TEXT NOT NULL,
      calories_per_100g REAL,
      protein_g         REAL,
      carbs_g           REAL,
      fat_g             REAL,
      created_at        DATETIME DEFAULT CURRENT_TIMESTAMP
    );
 
    CREATE TABLE IF NOT EXISTS meal_logs (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id          INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      food_id          INTEGER REFERENCES foods(id),
      custom_food_name TEXT,
      quantity_g       REAL    NOT NULL,
      meal_type        TEXT    CHECK(meal_type IN ('breakfast','lunch','dinner','snack')),
      logged_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
      notes            TEXT
    );
 
    CREATE TABLE IF NOT EXISTS recipes (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      title             TEXT NOT NULL,
      description       TEXT,
      ingredients       TEXT NOT NULL,
      instructions      TEXT NOT NULL,
      prep_time_minutes INTEGER,
      tags              TEXT,
      created_at        DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
 
  console.log('✓ Database ready at', DB_PATH);
}