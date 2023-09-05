import bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { JwtPayload } from 'jsonwebtoken';

import UserModel from '../model/user-model/user-model.js';
import { tokenService } from './token-service.js';

import { UserDto } from '../dto/user-dto.js';

import { ApiError } from '../exceptions/api-error.js';

import { Types } from 'mongoose';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
import { __dirname } from '../index.js';

export interface SignUpPayload {
    username: string;
    email: string;
    password: string;
}

export interface SignInPayload {
    email: string;
    password: string;
}

class UserService {
    async singUp({ email, password }: SignUpPayload) {
        const isExist = await UserModel.findOne({ email });
        if (isExist) {
            throw ApiError.BadRequest(`user with email ${email} already exists`);
        }
        const hashPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            email,
            password: hashPassword,
        });
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveRefreshToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        };
    }

    async singIn({ email, password }: SignInPayload) {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw ApiError.BadRequest(`the user with the email ${email} is not registered`);
        }

        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Incorrect password');
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveRefreshToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        };
    }

    async logout(refreshToken: string) {
        if (!refreshToken) {
            throw ApiError.BadRequest('Refresh token not provided');
        }

        return tokenService.removeToken(refreshToken);
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const userData = tokenService.validateRefreshToken(refreshToken) as JwtPayload;
        const isTokenExist = tokenService.findToken(refreshToken);

        if (!userData || !isTokenExist) {
            throw ApiError.UnauthorizedError();
        }

        const user = await UserModel.findById(userData.id);

        if (!user) {
            throw ApiError.BadRequest('Cannot find user');
        }

        const userDto = new UserDto(user);

        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveRefreshToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        };
    }

    async updateProfile(
        userId: Types.ObjectId | undefined,
        fields: { name?: string; surname?: string; email?: string },
        photo?: UploadedFile,
    ) {
        if (!userId) {
            throw ApiError.UnauthorizedError();
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            throw ApiError.UnauthorizedError();
        }

        let photoName;
        if (photo) {
            photoName = uuid.v4() + '.jpg';
            await photo.mv(path.resolve(__dirname, '..', 'src', 'static', photoName));
        }

        await UserModel.findByIdAndUpdate(
            userId,
            { ...fields, photo: photoName },
            {
                new: true,
                runValidators: true,
            },
        );

        return 'The user data has been successfully updated';
    }
}

export const userService = new UserService();
