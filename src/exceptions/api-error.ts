export class ApiError extends Error {
    status: number;
    errors: unknown[];

    constructor(status: number, message: string, errors: unknown[] = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError(): ApiError {
        return new ApiError(401, 'unauthorized user');
    }

    static BadRequest(message: string, errors: unknown[] = []): ApiError {
        return new ApiError(400, message, errors);
    }

    static Forbidden(): ApiError {
        return new ApiError(403, 'Forbidden');
    }

    static ServerError(): ApiError {
        return new ApiError(500, 'Server Error');
    }
}
