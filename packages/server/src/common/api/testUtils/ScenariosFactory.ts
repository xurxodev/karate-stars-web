import { Email, Entity, EntityData, Id, Password, User } from "karate-stars-core";
import * as CompositionRoot from "../../../CompositionRoot";
import { ServerDataCreator } from "./DataCreator";
import { FakeGenericRepository } from "./FakeGenericRepository";
import { FakeImageRepository } from "./FakeImageRepository";
import { FakeUserRepository } from "./FakeUserRepository";

export const givenThereAreAPrincipalAndRestItemsInServer = <
    TEntityData extends EntityData,
    TEntity extends Entity<TEntityData>
>(
    principalDataCeator: ServerDataCreator<TEntityData, TEntity>,
    restDataCreators?: ServerDataCreator<any, any>[]
) => {
    const principalItems = givenThereAreAnItemsInServer(principalDataCeator);

    if (restDataCreators) {
        restDataCreators.forEach(dependencyCreator => {
            givenThereAreAnItemsInServer(dependencyCreator);
        });
    }

    return principalItems;
};

export const givenThereAreAnItemsInServer = <
    TEntityData extends EntityData,
    TEntity extends Entity<TEntityData>
>(
    dataCreator: ServerDataCreator<TEntityData, TEntity>
) => {
    const initialItems = dataCreator.items();
    CompositionRoot.di.bindLazySingleton(
        dataCreator.repositoryKey,
        () => new FakeGenericRepository<TEntityData, TEntity>(initialItems)
    );

    CompositionRoot.di.bindLazySingleton(
        CompositionRoot.appDIKeys.imageRepository,
        () => new FakeImageRepository()
    );

    return initialItems.map(feed => feed.toData());
};

export const givenThereAreAnUserInServer = (params: { admin: boolean }) => {
    const user: User = User.createExisted({
        id: Id.generateId(),
        name: "Example user",
        image: "https://pbs.twimg.com/profile_images/1151113544362078209/chgA6VO9_400x400.jpg",
        email: Email.create("info@karatestarsapp.com").get(),
        password: Password.create("password").get(),
        isAdmin: params.admin,
        isClientUser: true,
    });

    CompositionRoot.di.bindLazySingleton(
        CompositionRoot.appDIKeys.userRepository,
        () => new FakeUserRepository([user])
    );

    return user;
};
