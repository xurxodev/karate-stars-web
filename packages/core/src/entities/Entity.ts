import { Id } from "../value-objects/Id";

export interface EntityData {
    id: Id;
}

export interface EntityRawData {
    id: string;
}

const isEntity = (v: any): v is Entity<any, any> => {
    return v instanceof Entity;
};

export abstract class Entity<Data extends EntityData, RawData extends EntityRawData> {
    constructor(public id: Id) {}

    abstract toRawData(): RawData;

    public equals(object?: Entity<Data, RawData>): boolean {
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
