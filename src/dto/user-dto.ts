import { User } from '../model/user-model/types.js';

export class UserDto {
    username;
    email;
    id;

    constructor(model: User) {
        this.username = model.username;
        this.email = model.email;
        this.id = model._id;
    }
}
