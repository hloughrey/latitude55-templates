import { dbPool } from '@latitude55/libs';
import { Task } from './dto';

export function mapTasks(tasks: Task[]) {
  return tasks.map((task) => [task.id || null, task.title, task.description || null, task.completed]);
}

export async function getAllTasks(): Promise<Task[]> {
  const query = `
    SELECT *
    FROM tasks
  `;
  const res = await dbPool.query(query);

  return res.rows;
}

export async function createTask({
  title,
  description,
  completed
}: Omit<Task, 'id' | 'createdDate' | 'lastUpdateDate'>): Promise<Task> {
  const query = `
    INSERT INTO tasks (title, description, completed) VALUES 
    ('${title}', '${description}', ${completed})
    RETURNING id
  `;

  const res = await dbPool.query(query);

  return res.rows[0];
}

export async function getTaskById(id: string): Promise<Task> {
  const query = `
  SELECT *
  FROM tasks
  WHERE id = '${id}'
`;
  const res = await dbPool.query(query);

  return res.rows[0];
}

export async function updateTaskById(
  id: string,
  { title, description, completed }: Omit<Task, 'id' | 'createdDate' | 'lastUpdateDate'>
): Promise<Task> {
  try {
    const updateQuery = `UPDATE tasks SET title = '${title}', description = '${description}', completed = ${completed} WHERE id = '${id}'`;
    await dbPool.query(updateQuery);

    return getTaskById(id);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteTaskById(id: string): Promise<string> {
  try {
    const query = `DELETE FROM tasks WHERE id = '${id}' RETURNING id`;
    const res = await dbPool.query(query);

    return res.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}
