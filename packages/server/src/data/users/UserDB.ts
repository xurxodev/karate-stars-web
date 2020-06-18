export interface UserDB {
    _id: string;
    name: string;
    image: string;
    username: string;
    password: string;
    isAdmin: boolean;
    isClientUser: boolean;
}
