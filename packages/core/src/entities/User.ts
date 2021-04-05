import { Entity, EntityObjectData, EntityData } from "./Entity";
import { Email } from "../value-objects/Email";
import { Password } from "../value-objects/Password";

interface UserObjectData extends EntityObjectData {
    name: string;
    image: string;
    email: Email;
    password: Password;
    isAdmin: boolean;
    isClientUser: boolean;
}

export interface UserData extends EntityData {
    name: string;
    image: string;
    email: string;
    password: string;
    isAdmin: boolean;
    isClientUser: boolean;
}

export class User extends Entity<UserData> {
    public readonly name: string;
    public readonly image: string;
    public readonly email: Email;
    public readonly password: Password;
    public readonly isAdmin: boolean;
    public readonly isClientUser: boolean;

    constructor(data: UserObjectData) {
        super(data.id);

        this.name = data.name;
        this.image = data.image;
        this.email = data.email;
        this.password = data.password;
        this.isAdmin = data.isAdmin;
        this.isClientUser = data.isClientUser;
    }

    //TODO: change param to UserData
    public static createExisted(data: UserObjectData) {
        return new User(data);
    }

    toData(): UserData {
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
