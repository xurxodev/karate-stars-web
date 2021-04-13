import { Entity, EntityData } from "karate-stars-core";

export interface ServerDataCreator<
    TEntityData extends EntityData,
    TEntity extends Entity<TEntityData>
> {
    repositoryKey: string;
    items: () => TEntity[];
}

export interface TestDataCreator<TEntityData extends EntityData> {
    givenAValidNewItem: () => TEntityData;
    givenAInvalidNewItem: () => TEntityData;
    givenAValidModifiedItem: () => TEntityData;
    givenAInvalidModifiedItem: () => TEntityData;
}
