import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';

interface ErrorResponse {
    success: boolean;
    message: string;
    errors: any[];
    stack?: string;
}

const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const isApiError = err instanceof ApiError;
    
    const statusCode = isApiError ? err.statusCode : 500;
    const message = err.message || "Internal Server Error";
    const errors = isApiError ? err.errors : [];
    
    const errorResponse: ErrorResponse = {
        success: false,
        message,
        errors,
    };

    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
    }
    
    if (!isApiError) {
        console.error("UNEXPECTED ERROR: ", err);
    }
    
    res.status(statusCode).json(errorResponse);
};

export default errorHandler;