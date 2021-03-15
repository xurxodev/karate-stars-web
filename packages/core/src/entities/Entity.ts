import { Id } from "../value-objects/Id";

export interface EntityData {
    id: Id;
}

export interface EntityRawData {
    id: string;
}

const isEntity = (v: any): v is Entity<any> => {
    return v instanceof Entity;
};

export abstract class Entity<RawData extends EntityRawData> implements EntityData {
    constructor(public id: Id) {}

    abstract toRawData(): RawData;

    public equals(object?: Entity<RawData>): boolean {
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
