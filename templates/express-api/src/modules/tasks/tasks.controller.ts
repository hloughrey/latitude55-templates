import { Request, Response, Router } from 'express';
import { Controller } from '@latitude55/types';
import { validateRequest } from '@latitude55/middleware';
import { createLogger } from '@latitude55/libs';
import { createTask, deleteTaskById, getAllTasks, getTaskById, updateTaskById } from './tasks.service';
import { Task } from './dto/task';

export class TaskController implements Controller {
  private path;
  public router = Router();
  logger = createLogger('Task');

  constructor(path) {
    this.path = path;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.logger.info(`Initialising ${this.path}'s`);
    this.router.get('/', this.getTasks);
    this.router.get('/:id', this.getTask);
    this.router.post('/', validateRequest(Task), this.createTask);
    this.router.put('/:id', validateRequest(Task), this.updateTask);
    this.router.delete('/:id', this.deleteTask);
  }

  private async getTasks(req: Request, res: Response) {
    this.logger.info('Mapping API Paths');
    try {
      const result = await getAllTasks();

      if (!result.length) {
        return res.status(404).json({ error: 'Not found' });
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ errorMessage: error.message });
    }
  }

  private async createTask(req: Request, res: Response) {
    try {
      const result = await createTask(req.body);

      if (!result) {
        return res.status(406).json({ error: 'Could not create task' });
      }

      return res.status(201).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errorMessage: error.message });
    }
  }

  private async getTask(req: Request, res: Response) {
    try {
      const result = await getTaskById(req.params.id);

      if (!result) {
        return res.status(404).json({ error: 'Not found' });
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ errorMessage: error.message });
    }
  }

  private async updateTask(req: Request, res: Response) {
    try {
      const result = await updateTaskById(req.params.id, req.body);

      if (!result) {
        return res.status(406).json({ error: `Could not update task, please check id.` });
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ errorMessage: error.message });
    }
  }

  private async deleteTask(req: Request, res: Response) {
    try {
      const result = await deleteTaskById(req.params.id);

      if (!result) {
        return res.status(406).json({ error: 'Could not delete task, please check id.' });
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ errorMessage: error.message });
    }
  }
}
