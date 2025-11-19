import { getDb } from '../config/db';

export const createTask = async (doctor_id: number, user_id: number, title: string, description = '') => {
  const db = getDb();
  const r = await db.run('INSERT INTO medical_tasks (doctor_id,user_id,title,description) VALUES (?,?,?,?)', doctor_id, user_id, title, description);
  return { id: r.lastID };
};

export const getTasksForUser = async (user_id: number) => {
  const db = getDb();
  return db.all('SELECT * FROM medical_tasks WHERE user_id = ? ORDER BY created_at DESC', user_id);
};

export const checkTask = async (taskId: number) => {
  const db = getDb();
  const r = await db.run('UPDATE medical_tasks SET is_checked = 1, checked_at = CURRENT_TIMESTAMP WHERE id = ?', taskId);
  return { changes: r.changes };
};

export const tasksNotCheckedToday = async () => {
  const db = getDb();
  const sql = `
    SELECT u.id as user_id, u.name as user_name, mt.id as task_id, mt.title, mt.is_checked, mt.checked_at
    FROM users u
    JOIN medical_tasks mt ON mt.user_id = u.id
    WHERE u.role='user' AND (
      mt.is_checked = 0 OR date(mt.checked_at) <> date('now')
    )
    ORDER BY u.id
  `;
  return db.all(sql);
};