import { Entity, EntityData, EntityRawData } from "./Entity";
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

export interface UserRawData extends EntityRawData {
    name: string;
    image: string;
    email: string;
    password: string;
    isAdmin: boolean;
    isClientUser: boolean;
}

export class User extends Entity<User, UserRawData> implements UserData {
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
        this.isClientUser = data.isClientUser;
    }

    public static createExisted(data: UserData) {
        return new User(data);
    }

    toRawData(): UserRawData {
        return {
            id: this.id.value,
            name: this.name,
            image: this.image,
            email: this.email.value,
            password: this.password.value,
            isAdmin: this.isAdmin,
            isClientUser: this.isClientUser,
        };
    }
}
