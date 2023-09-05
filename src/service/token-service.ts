import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

import TokenModel from '../model/token-model/token-model.js';
import { UserDTO } from '../model/user-model/types.js';

class TokenService {
    generateTokens(payload: UserDTO) {
        const accessToken: string = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
            expiresIn: '24h',
        });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
            expiresIn: '15d',
        });
        return { accessToken, refreshToken };
    }

    validateAccessToken(token: string) {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
    }

    validateRefreshToken(token: string) {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
    }

    async saveRefreshToken(userId: Types.ObjectId, refreshToken: string) {
        const existToken = await TokenModel.findOne({ user: userId });

        if (existToken) {
            existToken.refreshToken = refreshToken;
            return existToken.save();
        }

        return await TokenModel.create({ user: userId, refreshToken });
    }

    async removeToken(refreshToken: string) {
        return TokenModel.deleteOne({ refreshToken });
    }

    async findToken(refreshToken: string) {
        return TokenModel.findOne({ refreshToken });
    }
}

export const tokenService = new TokenService();
