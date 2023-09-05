import { Schema, model } from 'mongoose';
import { User } from './types.js';

const UserSchema = new Schema<User>({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    photo: { type: String },
    name: { type: String },
    surname: { type: String },
});

export default model<User>('User', UserSchema);
