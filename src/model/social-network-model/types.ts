import { Types } from 'mongoose';

export type SocialNetwork = {
    user: Types.ObjectId;
    name: string;
    url: string;
};
