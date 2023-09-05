import { Schema, model } from 'mongoose';
import { SocialNetwork } from './types.js';

const SocialNetworkSchema = new Schema<SocialNetwork>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
});

export default model<SocialNetwork>('SocialNetwork', SocialNetworkSchema);
