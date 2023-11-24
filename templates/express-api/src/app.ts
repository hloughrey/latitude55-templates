import express, { Express } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import { TaskController } from '@latitude55/modules/tasks';
import { TaskListController } from '@latitude55/modules/task-lists';
import { HealthCheckController } from '@latitude55/modules/health-check';
import { createLogger } from '@latitude55/libs';

export function getApp(): Express {
  const app = express();
  const logger = createLogger('Server');

  dotenv.config();
  app.use(cors());

  app.use(bodyParser.json());

  logger.info('Mapping API Paths');

  app.use('/api/', new HealthCheckController('/health-check').router);
  app.use('/api/tasks', new TaskController('/api/tasks').router);
  app.use('/api/task-lists', new TaskListController('/api/task-lists').router);
  app.use((req, res) => {
    const error = new Error('not found');
    return res.status(404).json({
      message: error.message
    });
  });

  return app;
}
