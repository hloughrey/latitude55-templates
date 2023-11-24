import request from 'supertest';
import format from 'pg-format';
import { Express } from 'express';
import { dbPool } from '@latitude55/libs';
import { mockCreateTaskList, mockTaskLists } from './task-lists.mocks';
import { mapTasks } from '../tasks/tasks.service';
import { mockTasks } from '../tasks/tasks.mocks';
import { getApp } from '../../app';

let app: Express;

beforeAll(() => {
  app = getApp();
});

beforeEach(async () => {
  const tasks = mapTasks(mockTasks);
  const insertTasksQuery = format(`INSERT INTO tasks (id, title, description, completed) VALUES %L`, tasks);
  await dbPool.query(insertTasksQuery);

  const taskLists = mapTasks(mockTaskLists);
  const insertTaskListsQuery = format(
    `INSERT INTO task_lists (id, title, description, completed) VALUES %L`,
    taskLists
  );
  await dbPool.query(insertTaskListsQuery);
});

afterEach(async () => {
  await dbPool.query(`TRUNCATE table task_lists CASCADE;`);
  await dbPool.query(`TRUNCATE table tasks CASCADE;`);
});

afterAll(async () => {
  await dbPool.end();
});

describe('Task Lists', () => {
  const basePath = '/api/task-lists';
  describe('[GET] /task-lists', () => {
    it('should get all tasks', async () => {
      const { statusCode, body } = await request(app).get(basePath);
      expect(statusCode).toEqual(200);
      expect(body).toHaveLength(2);
    });
  });

  describe('[GET] /task-lists/:id', () => {
    it('should get a task list by Id', async () => {
      const { statusCode, body } = await request(app).get(`${basePath}/9e2cfb2c-343e-4154-b99e-96ba64f38fe7`);
      expect(statusCode).toEqual(200);
      expect(body).toEqual(
        expect.objectContaining({
          title: mockTaskLists[1].title,
          description: mockTaskLists[1].description,
          completed: mockTaskLists[1].completed,
          tasks: []
        })
      );
    });

    it('should get a task list by Id with tasks populated', async () => {
      const tasks_task_insert_query = format(`INSERT INTO tasks_task_lists (tasks_id, task_list_id) VALUES %L;`, [
        ['5de6e371-3bf2-48dc-a4a7-1deb31308030', '9e2cfb2c-343e-4154-b99e-96ba64f38fe7'],
        ['5ab94c79-6023-4b4d-857d-01e5018186f8', '9e2cfb2c-343e-4154-b99e-96ba64f38fe7']
      ]);
      await dbPool.query(tasks_task_insert_query);

      const { statusCode, body } = await request(app).get(`${basePath}/9e2cfb2c-343e-4154-b99e-96ba64f38fe7`);
      expect(statusCode).toEqual(200);
      expect(body).toEqual(
        expect.objectContaining({
          title: mockTaskLists[1].title,
          description: mockTaskLists[1].description,
          completed: mockTaskLists[1].completed,
          tasks: [
            {
              completed: true,
              description: 'Create API repo',
              title: 'Create repo'
            },
            {
              completed: false,
              description: 'Create basic structure for api',
              title: 'Scaffold application'
            }
          ]
        })
      );
    });
  });

  describe('[POST] /task-lists', () => {
    describe('success - 2xx HTTP status code', () => {
      it('should create a new Task', async () => {
        const { statusCode, body } = await request(app).post(basePath).send(mockCreateTaskList);

        const { rows } = await dbPool.query(`
          SELECT tl.*,
          JSON_AGG(JSON_BUILD_OBJECT(
            'title', t.title,
            'description', t.description,
            'completed', t.completed
          )) AS tasks
          FROM task_lists tl
          LEFT JOIN tasks_task_lists ttl ON ttl.task_list_id = tl.id
          LEFT JOIN tasks t ON t.id = ttl.tasks_id
          WHERE tl.id = '${body.id}'
          GROUP BY tl.id;
        `);

        expect(statusCode).toEqual(201);
        expect(rows[0].tasks).toHaveLength(2);
      });
    });

    describe('error - 4xx HTTP status code', () => {
      it.each`
        scenario                            | taskList                                                                    | expectedError
        ${'Missing title'}                  | ${{ description: 'Mop kitchen floor', completed: true }}                    | ${'title should not be empty'}
        ${'Missing description'}            | ${{ title: 'Mop kitchen', completed: true }}                                | ${'description should not be empty'}
        ${'Missing completed'}              | ${{ title: 'Mop kitchen', description: 'Mop kitchen floor' }}               | ${'completed should not be empty'}
        ${'Title is wrong data type'}       | ${{ title: 1, description: 'Mop kitchen floor', completed: true }}          | ${'title must be a string'}
        ${'Description is wrong data type'} | ${{ title: 'Mop kitchen', description: false, completed: true }}            | ${'description must be a string'}
        ${'Completd is wrong data type'}    | ${{ title: 'Mop kitchen', description: 'Mop kitchen floor', completed: 2 }} | ${'completed must be a boolean value'}
      `('should return a 400 error when $scenario', async ({ taskList, expectedError }) => {
        const {
          statusCode,
          body: { errors }
        } = await await request(app).post(basePath).send(taskList);
        expect(statusCode).toEqual(400);
        expect(errors[0]).toEqual(expectedError);
      });
    });
  });

  describe('[PUT] /task-lists/:id', () => {
    describe('success - 2xx HTTP status code', () => {
      it('should update task list by id', async () => {
        const { statusCode } = await await request(app).put(`${basePath}/9e2cfb2c-343e-4154-b99e-96ba64f38fe7`).send({
          title: 'Mop kitchen',
          description: 'Mop kitchen floor',
          completed: true,
          tasks: []
        });
        expect(statusCode).toEqual(200);

        const { rows } = await dbPool.query(
          `SELECT * FROM task_lists WHERE id = '9e2cfb2c-343e-4154-b99e-96ba64f38fe7';`
        );
        expect(rows[0]).toEqual(
          expect.objectContaining({ title: 'Mop kitchen', description: 'Mop kitchen floor', completed: true })
        );
      });
    });

    describe('error - 4xx HTTP status code', () => {
      it.each`
        scenario                            | taskList                                                                    | expectedError
        ${'Missing title'}                  | ${{ description: 'Mop kitchen floor', completed: true }}                    | ${'title should not be empty'}
        ${'Missing description'}            | ${{ title: 'Mop kitchen', completed: true }}                                | ${'description should not be empty'}
        ${'Missing completed'}              | ${{ title: 'Mop kitchen', description: 'Mop kitchen floor' }}               | ${'completed should not be empty'}
        ${'Title is wrong data type'}       | ${{ title: 1, description: 'Mop kitchen floor', completed: true }}          | ${'title must be a string'}
        ${'Description is wrong data type'} | ${{ title: 'Mop kitchen', description: false, completed: true }}            | ${'description must be a string'}
        ${'Completd is wrong data type'}    | ${{ title: 'Mop kitchen', description: 'Mop kitchen floor', completed: 2 }} | ${'completed must be a boolean value'}
      `('should return a 400 error when $scenario', async ({ taskList, expectedError }) => {
        const {
          statusCode,
          body: { errors }
        } = await await request(app).put(`${basePath}/9e2cfb2c-343e-4154-b99e-96ba64f38fe7`).send(taskList);
        expect(statusCode).toEqual(400);
        expect(errors[0]).toEqual(expectedError);
      });
    });
  });

  describe('[DELETE] /task-lists/:id', () => {
    it('should delete task by id', async () => {
      const { statusCode } = await request(app).delete(`${basePath}/9e2cfb2c-343e-4154-b99e-96ba64f38fe7`);
      expect(statusCode).toEqual(200);

      const { rows } = await dbPool.query(
        `SELECT * FROM task_lists WHERE id = '9e2cfb2c-343e-4154-b99e-96ba64f38fe7';`
      );
      expect(rows).toHaveLength(0);
    });
  });
});
