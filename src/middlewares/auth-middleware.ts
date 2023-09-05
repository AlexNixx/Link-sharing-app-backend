import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../exceptions/api-error.js';
import { tokenService } from '../service/token-service.js';
import { UserDTO } from '../model/user-model/types.js';

export interface RequestWithUser extends Request {
    user?: UserDTO;
}

export async function authMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError());
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.UnauthorizedError());
        }

        const userData = tokenService.validateAccessToken(accessToken) as UserDTO;

        if (!userData) {
            return next(ApiError.Forbidden());
        }

        req.user = userData;

        next();
    } catch (error) {
        return next(ApiError.ServerError());
    }
}
