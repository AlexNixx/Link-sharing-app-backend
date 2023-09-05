import { User } from '../model/user-model/types.js';

export class UserDto {
    id;
    email;
    photo;
    name;
    surname;

    constructor(model: User) {
        this.id = model._id;
        this.email = model.email;
        this.photo = model.photo;
        this.name = model.name;
        this.surname = model.surname;
    }
}
