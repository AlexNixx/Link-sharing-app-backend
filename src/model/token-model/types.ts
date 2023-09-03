import { Types } from 'mongoose';

export type Token = {
    user: Types.ObjectId;
    refreshToken: string;
};
