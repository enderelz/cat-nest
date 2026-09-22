import { Request, Response, NextFunction } from 'express';
import { als } from './request-context.js';

export function logger(req: Request, res: Response, next: NextFunction) {
  const randomUUID = crypto.randomUUID();
  als.run(randomUUID, () => {
    next();
  });
}
