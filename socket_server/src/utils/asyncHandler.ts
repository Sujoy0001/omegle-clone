import { Request, Response, NextFunction } from 'express';

const asyncHandler = <T = any>(reqHandler: (req: Request, res: Response, next: NextFunction) => Promise<T>) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(reqHandler(req, res, next)).catch((err) => next(err));
    };
};

export { asyncHandler };