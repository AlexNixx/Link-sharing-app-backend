import { Response } from 'express';
import { ApiError } from '../exceptions/api-error.js';

export default function (err: unknown, res: Response) {
    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message, errors: err.errors });
    }

    return res.status(500).json({ message: 'unexpected error' });
}
