import { Id } from "../value-objects/Id";

export interface EntityObjectData {
    id: Id;
}

export interface EntityData {
    id: string;
}

const isEntity = (v: any): v is Entity<any> => {
    return v instanceof Entity;
};

export abstract class Entity<Data extends EntityData> implements EntityObjectData {
    constructor(public id: Id) {}

    abstract toData(): Data;

    public equals(object?: Entity<Data>): boolean {
        if (object === null || object === undefined) {
            return false;
        }

        if (this === object) {
            return true;
        }

        if (!isEntity(object)) {
            return false;
        }

        return this.id.equals(object.id);
    }
}
