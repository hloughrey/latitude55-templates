import format from 'pg-format';
import { dbPool } from '@latitude55/libs';
import { TaskList } from './dto';

export function mapTaskLists(taskList: TaskList[]) {
  return taskList.map((taskList) => [taskList.id, taskList.title, taskList.description, taskList.completed]);
}

export async function getAllTaskLists(): Promise<TaskList[]> {
  const query = `
    SELECT tl.*,
    COALESCE(JSON_AGG(JSON_BUILD_OBJECT(
         'title', t.title,
         'description', t.description,
         'completed', t.completed
       )) FILTER (WHERE t.title IS NOT NULL), '[]') AS tasks
    FROM task_lists tl
    LEFT JOIN tasks_task_lists ttl ON ttl.task_list_id = tl.id
    LEFT JOIN tasks t ON t.id = ttl.tasks_id
    GROUP BY tl.id;
  `;
  const res = await dbPool.query(query);

  return res.rows;
}

export async function createTaskList({
  title,
  description,
  completed,
  tasks
}: Omit<TaskList, 'id' | 'createdDate' | 'lastUpdateDate'>): Promise<TaskList> {
  try {
    await dbPool.query('BEGIN');
    const insertIntoTaskListQuery = `
      INSERT INTO task_lists (title, description, completed) VALUES 
      ('${title}', '${description}', ${completed})
      RETURNING id;
    `;
    const { rows: taskListsQueryResult } = await dbPool.query(insertIntoTaskListQuery);

    const tasksTaskLists = tasks.map((task) => [task, taskListsQueryResult[0].id]);
    const insertIntoTasksTaskListsQuery = format(
      `INSERT INTO tasks_task_lists (tasks_id, task_list_id) VALUES %L;`,
      tasksTaskLists
    );
    await dbPool.query(insertIntoTasksTaskListsQuery);

    await dbPool.query('COMMIT');

    return getTaskListById(taskListsQueryResult[0].id);
  } catch (error) {
    await dbPool.query('ROLLBACK');
    throw error;
  }
}

export async function getTaskListById(id: string): Promise<TaskList> {
  const query = `
    SELECT tl.*,
    COALESCE(JSON_AGG(JSON_BUILD_OBJECT(
         'title', t.title,
         'description', t.description,
         'completed', t.completed
       )) FILTER (WHERE t.title IS NOT NULL), '[]') AS tasks
    FROM task_lists tl
    LEFT JOIN tasks_task_lists ttl ON ttl.task_list_id = tl.id
    LEFT JOIN tasks t ON t.id = ttl.tasks_id
    WHERE tl.id = '${id}'
    GROUP BY tl.id;
  `;

  const res = await dbPool.query(query);

  return res.rows[0];
}

export async function updateTaskListById(
  id: string,
  { title, description, completed }: Pick<TaskList, 'title' | 'description' | 'completed'>
): Promise<TaskList> {
  try {
    const query = `UPDATE task_lists SET title = '${title}', description = '${description}', completed = ${completed} WHERE id = '${id}'`;
    await dbPool.query(query);

    return getTaskListById(id);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteTaskListById(id: string): Promise<string> {
  try {
    const query = `DELETE FROM task_lists WHERE id = '${id}' RETURNING id`;
    const res = await dbPool.query(query);

    return res.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}
