import { getDb } from './db';
import { hash } from '../utils/hash';
import dotenv from 'dotenv';

dotenv.config();

export const seedAdmin = async () => {
  const db = getDb();
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@admin.com';
  const pass = process.env.SEED_ADMIN_PASS || 'admin123';
  const name = 'Super Admin';

  const row = await db.get('SELECT * FROM users WHERE email = ?', email);
  if (row) {
    console.log('Admin already exists');
    return;
  }
  const hashed = await hash(pass);
  await db.run('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)', name, email, hashed, 'admin');
  console.log('Seeded admin:', email);
};