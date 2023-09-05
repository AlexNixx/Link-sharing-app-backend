import { ApiError } from '../exceptions/api-error.js';
import { Types } from 'mongoose';
import UserModel from '../model/user-model/user-model.js';
import SocialNetworkModel from '../model/social-network-model/social-network-model.js';

export interface CreatePayload {
    name: string;
    url: string;
    userId?: Types.ObjectId;
}

class SocialNetworkService {
    async getMyLinks(userId: Types.ObjectId | undefined) {
        if (!userId) {
            throw ApiError.UnauthorizedError();
        }
        return SocialNetworkModel.find({ user: userId });
    }

    async createOrUpdate(userId: Types.ObjectId | undefined, links: Array<{ name: string; url: string }>) {
        if (!userId) {
            throw ApiError.UnauthorizedError();
        }

        if (!Array.isArray(links)) {
            throw ApiError.BadRequest('Links should be an array');
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            throw ApiError.UnauthorizedError();
        }

        await SocialNetworkModel.deleteMany({ user: userId });

        for (const link of links) {
            await SocialNetworkModel.create({ user: userId, name: link.name, url: link.url });
        }

        return 'The links were created or updated successfully';
    }

    async delete(userId: Types.ObjectId | undefined, socialId: Types.ObjectId | string) {
        if (!userId) {
            throw ApiError.UnauthorizedError();
        }

        if (!socialId) {
            throw ApiError.BadRequest('The social media link id is not specified');
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            throw ApiError.UnauthorizedError();
        }

        const social = await SocialNetworkModel.findById(socialId);

        if (!social) {
            throw ApiError.BadRequest('This social network is not in the database');
        }

        await SocialNetworkModel.findOneAndDelete({ _id: socialId, user: userId });

        return 'The social network was successfully removed';
    }
}

export const socialNetworkService = new SocialNetworkService();
