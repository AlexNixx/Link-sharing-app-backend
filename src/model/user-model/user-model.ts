import { Schema, model } from 'mongoose';
import { User } from './types.js';

const UserSchema = new Schema<User>({
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});

export default model<User>('User', UserSchema);
