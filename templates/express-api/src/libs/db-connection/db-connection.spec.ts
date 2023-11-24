import { dbPool } from './db.connection';

afterAll(async () => {
  dbPool.end();
});

describe('DB Connection', () => {
  it('should connect to db', async () => {
    const res = await dbPool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_catalog = '${process.env.DB_DATABASE_TEST}'
      AND table_name = ANY ('{tasks, task_lists, tasks_task_lists}')`);

    expect(res.rows.length).toEqual(3);
  });
});
