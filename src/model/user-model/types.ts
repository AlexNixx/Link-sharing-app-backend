import { Types } from 'mongoose';

export type User = {
    _id: Types.ObjectId;
    username: string;
    email: string;
    password: string;
};

export type UserDTO = {
    id: Types.ObjectId;
    username: string;
    email: string;
};
