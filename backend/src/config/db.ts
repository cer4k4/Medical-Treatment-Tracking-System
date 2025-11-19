import sqlite3 from 'sqlite3';
import path from 'path';
import { open, Database } from 'sqlite';
import dotenv from 'dotenv';

dotenv.config();

const dbFile = process.env.DATABASE_FILE || path.join(__dirname, '../../data/database.sqlite');

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export const init = async () => {
  db = await open({ filename: dbFile, driver: sqlite3.Database });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT CHECK(role IN ('admin','doctor','user')) NOT NULL DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS medical_tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      doctor_id INTEGER,
      user_id INTEGER,
      title TEXT,
      description TEXT,
      is_checked INTEGER DEFAULT 0,
      checked_at DATETIME NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(doctor_id) REFERENCES users(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS disease_guides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      disease_name TEXT,
      content TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('SQLite initialized at', dbFile);
};

export const getDb = () => {
  if (!db) throw new Error('Database not initialized. Call init() first.');
  return db;
};