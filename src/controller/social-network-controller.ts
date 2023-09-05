import { NextFunction, Response } from 'express';
import { socialNetworkService } from '../service/social-network-service.js';
import { RequestWithUser } from '../middlewares/auth-middleware.js';

class SocialNetworkController {
    async createOrUpdate(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const links = req.body;
            const userId = req.user?.id;
            const message = await socialNetworkService.createOrUpdate(userId, links);

            return res.status(200).json(message);
        } catch (error) {
            next(error);
        }
    }

    async delete(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const socialId = req.params.id;
            const userId = req.user?.id;
            const message = await socialNetworkService.delete(userId, socialId);

            return res.status(200).json(message);
        } catch (error) {
            next(error);
        }
    }

    async getMyLinks(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const links = await socialNetworkService.getMyLinks(userId);

            return res.json(links);
        } catch (error) {
            next(error);
        }
    }
}

export const socialNetworkController = new SocialNetworkController();
