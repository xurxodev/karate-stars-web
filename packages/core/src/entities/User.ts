import { Entity, EntityData } from "./Entity";
import { Id } from "../value-objects/Id";
import { Email } from "../value-objects/Email";
import { Password } from "../value-objects/Password";

export interface UserData extends EntityData {
    name: string;
    image: string;
    email: Email;
    password: Password;
    isAdmin: boolean;
    isClientUser: boolean;
}

export class User extends Entity<User> implements UserData {
    public readonly id: Id;
    public readonly name: string;
    public readonly image: string;
    public readonly email: Email;
    public readonly password: Password;
    public readonly isAdmin: boolean;
    public readonly isClientUser: boolean;

    constructor(data: UserData) {
        super(data.id);

        this.name = data.name;
        this.image = data.image;
        this.email = data.email;
        this.password = data.password;
        this.isAdmin = data.isAdmin;
        this.isClientUser = data.isAdmin;
    }

    public static createExisted(data: UserData) {
        return new User(data);
    }
}
