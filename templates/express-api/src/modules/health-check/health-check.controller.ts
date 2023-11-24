import { Request, Response, Router } from 'express';
import { Controller } from '@latitude55/types';

export class HealthCheckController implements Controller {
  private path;
  public router = Router();

  constructor(path) {
    this.path = path;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.healthCheck);
  }

  private healthCheck = (req: Request, res: Response) => {
    return res.sendStatus(200);
  };
}
