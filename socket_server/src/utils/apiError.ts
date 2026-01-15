interface ErrorDetail {
    field?: string;
    message: string;
}

class ApiError extends Error {
    public statusCode: number;
    public data: any | null;
    public success: boolean;
    public errors: ErrorDetail[];

    constructor(
        statusCode: number,
        message: string = "Something went wrong",
        errors: ErrorDetail[] = [],
        stack: string = ""
    ) {
        super(message);
        
        Object.setPrototypeOf(this, ApiError.prototype);

        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };