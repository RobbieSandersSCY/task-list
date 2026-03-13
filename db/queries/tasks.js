import db from "#db/client";

/**
 * Creates a new task with the provided information
 * @param {string} title
 * @param {boolean} done
 * @param {number} user_id
 * @returns
 */
export async function createTask({ title, done, user_id }) {
  const sql = `
  INSERT INTO tasks
    (title, done, user_id)
  VALUES
    ($1, $2, $3)
  RETURNING *
  `;
  const {
    rows: [task],
  } = await db.query(sql, [title, done, user_id]);
  return task;
}

export async function getTasksById(id) {
  const sql = `
  SELECT *
  FROM tasks
  WHERE id = $1
  `;
  const {
    rows: [task],
  } = await db.query(sql, [id]);
  return task;
}

export async function getTasksByUserId(user_id) {
  const sql = `
  SELECT *
  FROM tasks
  WHERE user_id = $1
  `;
  const { rows: tasks } = await db.query(sql, [user_id]);
  return tasks;
}

export async function updateTask({ id, title, done }) {
  const sql = `
  UPDATE tasks
  SET title = $2, done = $3
  WHERE id = $1
  RETURNING *
  `;
  const {
    rows: [task],
  } = await db.query(sql, [id, title, done]);
  return task;
}

export async function deleteTask(id) {
  const sql = `
  DELETE FROM tasks
  WHERE id = $1
  `;
  await db.query(sql, [id]);
}
