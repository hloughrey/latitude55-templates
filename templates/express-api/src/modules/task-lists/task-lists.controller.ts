import { Request, Response, Router } from 'express';
import { Controller } from '@latitude55/types';
import { validateRequest } from '@latitude55/middleware';
import { createLogger } from '@latitude55/libs';
import {
  createTaskList,
  deleteTaskListById,
  getAllTaskLists,
  getTaskListById,
  updateTaskListById
} from './task-lists.service';
import { TaskList } from './dto/task-lists';

export class TaskListController implements Controller {
  private path;
  public router = Router();
  logger = createLogger('Task List');

  constructor(path) {
    this.path = path;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.logger.info(`Initialising ${this.path}'s`);
    this.router.get('/', this.getTaskLists);
    this.router.get('/:id', this.getTaskList);
    this.router.post('/', validateRequest(TaskList), this.createTaskList);
    this.router.put('/:id', validateRequest(TaskList), this.updateTaskList);
    this.router.delete('/:id', this.deleteTaskList);
  }

  private async getTaskLists(req: Request, res: Response) {
    try {
      const result = await getAllTaskLists();

      if (!result.length) {
        return res.status(404).json({ error: 'Not found' });
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ errorMessage: error.message });
    }
  }

  private async createTaskList(req: Request, res: Response) {
    try {
      const result = await createTaskList(req.body);

      if (!result) {
        return res.status(406).json({ error: 'Could not create task list' });
      }

      return res.status(201).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errorMessage: error.message });
    }
  }

  private async getTaskList(req: Request, res: Response) {
    try {
      const result = await getTaskListById(req.params.id);

      if (!result) {
        return res.status(404).json({ error: 'Not found' });
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ errorMessage: error.message });
    }
  }

  private async updateTaskList(req: Request, res: Response) {
    try {
      const result = await updateTaskListById(req.params.id, req.body);

      if (!result) {
        return res.status(406).json({ error: 'Could not update task list, please check id.' });
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ errorMessage: error.message });
    }
  }

  private async deleteTaskList(req: Request, res: Response) {
    try {
      const result = await deleteTaskListById(req.params.id);

      if (!result) {
        return res.status(406).json({ error: 'Could not delete task list, please check id.' });
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ errorMessage: error.message });
    }
  }
}
