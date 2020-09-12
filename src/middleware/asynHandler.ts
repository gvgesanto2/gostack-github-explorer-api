import { Request, Response, NextFunction } from 'express';

interface AsyncMiddlewareFunction extends CallableFunction {
  (req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}

const asyncHandler = (fn: AsyncMiddlewareFunction) => (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
