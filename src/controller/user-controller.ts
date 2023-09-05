import { NextFunction, Request, Response } from 'express';
import { SignInPayload, SignUpPayload, userService } from '../service/user-service.js';
import { UploadedFile } from 'express-fileupload';
import { RequestWithUser } from '../middlewares/auth-middleware.js';

class UserController {
    async singUp(req: Request<SignUpPayload>, res: Response, next: NextFunction) {
        try {
            const user = await userService.singUp(req.body);
            res.cookie('refreshToken', user.refreshToken, {
                maxAge: 15 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });

            return res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async singIn(req: Request<SignInPayload>, res: Response, next: NextFunction) {
        try {
            const user = await userService.singIn(req.body);
            res.cookie('refreshToken', user.refreshToken, {
                maxAge: 15 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });

            return res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const refreshToken: string = req.cookies.refreshToken;
            await userService.logout(refreshToken);
            res.clearCookie('refreshToken');

            return res.status(200).json('Token deleted');
        } catch (error) {
            next(error);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const refreshToken: string = req.cookies.refreshToken;
            const user = await userService.refresh(refreshToken);
            res.cookie('refreshToken', user.refreshToken, {
                maxAge: 15 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });

            return res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const field = req.body;
            const photo = req.files?.photo as UploadedFile;

            const message = await userService.updateProfile(userId, field, photo);

            return res.status(200).json(message);
        } catch (error) {
            next(error);
        }
    }
}

export const userController = new UserController();
