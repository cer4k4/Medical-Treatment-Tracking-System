import { getDb } from '../config/db';

export interface UserRow {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'doctor' | 'user';
  created_at?: string;
}

export const createUser = async (name: string, email: string, password: string, role: UserRow['role'] = 'user') => {
  const db = getDb();
  const result = await db.run('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)', name, email, password, role);
  return { id: result.lastID };
};

export const findByEmail = async (email: string): Promise<UserRow | undefined> => {
  const db = getDb();
  return db.get<UserRow>('SELECT * FROM users WHERE email = ?', email);
};

export const findById = async (id: number): Promise<UserRow | undefined> => {
  const db = getDb();
  return db.get<UserRow>('SELECT id,name,email,role,created_at FROM users WHERE id = ?', id);
};

export const listDoctors = async () => {
  const db = getDb();
  return db.all<Pick<UserRow, 'id' | 'name' | 'email' | 'created_at'>>(`SELECT id, name, email, created_at FROM users WHERE role='doctor'`);
};