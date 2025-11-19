import { getDb } from '../config/db';

export const listGuides = async () => {
  const db = getDb();
  return db.all('SELECT * FROM disease_guides ORDER BY created_at DESC');
};

export const createGuide = async (disease_name: string, content: string) => {
  const db = getDb();
  const r = await db.run('INSERT INTO disease_guides (disease_name,content) VALUES (?,?)', disease_name, content);
  return { id: r.lastID };
};