import { Types } from 'mongoose';

export type User = {
    _id: Types.ObjectId;
    email: string;
    password: string;
    photo?: string;
    name?: string;
    surname?: string;
};

export type UserDTO = {
    id: Types.ObjectId;
    email: string;
    photo?: string;
    name?: string;
    surname?: string;
};
