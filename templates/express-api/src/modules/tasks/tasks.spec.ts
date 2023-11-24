import request from 'supertest';
import format from 'pg-format';
import { Express } from 'express';
import { dbPool } from '@latitude55/libs';
import { mapTasks } from './tasks.service';
import { mockTasks } from './tasks.mocks';
import { getApp } from '../../app';

let app: Express;

beforeAll(() => {
  app = getApp();
});

beforeEach(async () => {
  const tasks = mapTasks(mockTasks);
  const insertTasksQuery = format(`INSERT INTO tasks (id, title, description, completed) VALUES %L`, tasks);
  await dbPool.query(insertTasksQuery);
});

afterEach(async () => {
  await dbPool.query(`TRUNCATE table tasks CASCADE;`);
});

afterAll(async () => {
  await dbPool.end();
});

describe('Tasks', () => {
  const basePath = '/api/tasks';
  describe('[GET] /tasks', () => {
    it('should get all tasks', async () => {
      const { statusCode, body } = await request(app).get(basePath);
      expect(statusCode).toEqual(200);
      expect(body).toHaveLength(4);
    });
  });

  describe('[GET] /tasks/:id', () => {
    it('should get a task by id', async () => {
      const { statusCode, body } = await request(app).get(`${basePath}/469462cd-5408-4427-89fa-ea2ad9d11290`);
      expect(statusCode).toEqual(200);
      expect(body).toEqual(
        expect.objectContaining({
          title: mockTasks[0].title,
          description: mockTasks[0].description,
          completed: mockTasks[0].completed
        })
      );
    });
  });

  describe('[POST] /tasks', () => {
    describe('success - 2xx HTTP status code', () => {
      it('should create a new Task', async () => {
        const { statusCode, body } = await request(app).post(basePath).send({
          title: 'Make dinner',
          description: 'Make the dinner for everyone',
          completed: false
        });

        const { rows } = await dbPool.query(`SELECT * FROM tasks WHERE id = '${body.id}';`);

        expect(statusCode).toEqual(201);
        expect(rows[0]).toHaveProperty('title', 'Make dinner');
        expect(rows[0]).toEqual(
          expect.objectContaining({
            title: 'Make dinner',
            description: 'Make the dinner for everyone',
            completed: false
          })
        );
      });
    });

    describe('error - 4xx HTTP status code', () => {
      it.each`
        scenario                            | task                                                                        | expectedError
        ${'Missing title'}                  | ${{ description: 'Mop kitchen floor', completed: true }}                    | ${'title should not be empty'}
        ${'Missing description'}            | ${{ title: 'Mop kitchen', completed: true }}                                | ${'description should not be empty'}
        ${'Missing completed'}              | ${{ title: 'Mop kitchen', description: 'Mop kitchen floor' }}               | ${'completed should not be empty'}
        ${'Title is wrong data type'}       | ${{ title: 1, description: 'Mop kitchen floor', completed: true }}          | ${'title must be a string'}
        ${'Description is wrong data type'} | ${{ title: 'Mop kitchen', description: false, completed: true }}            | ${'description must be a string'}
        ${'Completd is wrong data type'}    | ${{ title: 'Mop kitchen', description: 'Mop kitchen floor', completed: 2 }} | ${'completed must be a boolean value'}
      `('should return a 400 error when $scenario', async ({ task, expectedError }) => {
        const {
          statusCode,
          body: { errors }
        } = await await request(app).post(basePath).send(task);
        expect(statusCode).toEqual(400);
        expect(errors[0]).toEqual(expectedError);
      });
    });
  });

  describe('[PUT] /tasks/:id', () => {
    describe('success - 2xx HTTP status code', () => {
      it('should update task by id', async () => {
        const { statusCode } = await await request(app).put(`${basePath}/469462cd-5408-4427-89fa-ea2ad9d11290`).send({
          title: 'Mop kitchen',
          description: 'Mop kitchen floor',
          completed: true
        });
        expect(statusCode).toEqual(200);

        const { rows } = await dbPool.query(`SELECT * FROM tasks WHERE id = '469462cd-5408-4427-89fa-ea2ad9d11290';`);
        expect(rows[0]).toEqual(
          expect.objectContaining({ title: 'Mop kitchen', description: 'Mop kitchen floor', completed: true })
        );
      });
    });

    describe('error - 4xx HTTP status code', () => {
      it.each`
        scenario                            | task                                                                        | expectedError
        ${'Missing title'}                  | ${{ description: 'Mop kitchen floor', completed: true }}                    | ${'title should not be empty'}
        ${'Missing description'}            | ${{ title: 'Mop kitchen', completed: true }}                                | ${'description should not be empty'}
        ${'Missing completed'}              | ${{ title: 'Mop kitchen', description: 'Mop kitchen floor' }}               | ${'completed should not be empty'}
        ${'Title is wrong data type'}       | ${{ title: 1, description: 'Mop kitchen floor', completed: true }}          | ${'title must be a string'}
        ${'Description is wrong data type'} | ${{ title: 'Mop kitchen', description: false, completed: true }}            | ${'description must be a string'}
        ${'Completd is wrong data type'}    | ${{ title: 'Mop kitchen', description: 'Mop kitchen floor', completed: 2 }} | ${'completed must be a boolean value'}
      `('should return a 400 error when $scenario', async ({ task, expectedError }) => {
        const {
          statusCode,
          body: { errors }
        } = await await request(app).put(`${basePath}/469462cd-5408-4427-89fa-ea2ad9d11290`).send(task);
        expect(statusCode).toEqual(400);
        expect(errors[0]).toEqual(expectedError);
      });
    });
  });

  describe('[DELETE] /tasks/:id', () => {
    it('should delete task by id', async () => {
      const { statusCode } = await request(app).delete(`${basePath}/469462cd-5408-4427-89fa-ea2ad9d11290`);
      expect(statusCode).toEqual(200);

      const { rows } = await dbPool.query(`SELECT * FROM tasks WHERE id = '469462cd-5408-4427-89fa-ea2ad9d11290';`);
      expect(rows).toHaveLength(0);
    });
  });
});
