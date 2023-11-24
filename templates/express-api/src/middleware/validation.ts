import { NextFunction, Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export function validateRequest(validation) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const errorsMessages: string[][] = [];
    const body = plainToInstance(validation, req.body);
    const errors = await validate(body, {
      whitelist: true,
      forbidNonWhitelisted: true
    });

    if (errors.length) {
      errors.forEach((error) => {
        if (error.constraints) {
          errorsMessages.push(Object.values(error.constraints));
        }
      });
      res.status(400).json({ errors: errorsMessages.flat() });
    } else {
      next();
    }
  };
}
