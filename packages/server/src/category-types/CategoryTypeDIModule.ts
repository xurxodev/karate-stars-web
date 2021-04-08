import { MongoConector } from "../common/data/MongoConector";
import { appDIKeys, di } from "../CompositionRoot";
import UserRepository from "../users/domain/boundaries/UserRepository";
import { CategoryTypeController } from "./api/CategoryTypeController";
import CategoryTypeMongoRepository from "./data/CategoryTypeMongoRepository";
import CategoryTypeRepository from "./domain/boundaries/CategoryTypeRepository";
import { CreateCategoryTypeUseCase } from "./domain/usecases/CreateCategoryTypeUseCase";
import { DeleteCategoryTypeUseCase } from "./domain/usecases/DeleteCategoryTypeUseCase";
import { GetCategoryTypesUseCase } from "./domain/usecases/GetCategoryTypesUseCase";
import { GetCategoryTypeByIdUseCase } from "./domain/usecases/GetCategoryTypeByIdUseCase";
import { UpdateCategoryTypeUseCase } from "./domain/usecases/UpdateCategoryTypeUseCase";

export const categoryTypeDIKeys = {
    CategoryTypeRepository: "CategoryTypeRepository",
};

export function initializeCategoryTypes() {
    di.bindLazySingleton(
        categoryTypeDIKeys.CategoryTypeRepository,
        () => new CategoryTypeMongoRepository(di.get(MongoConector))
    );

    di.bindLazySingleton(
        GetCategoryTypesUseCase,
        () =>
            new GetCategoryTypesUseCase(
                di.get<CategoryTypeRepository>(categoryTypeDIKeys.CategoryTypeRepository),
                di.get<UserRepository>(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        GetCategoryTypeByIdUseCase,
        () =>
            new GetCategoryTypeByIdUseCase(
                di.get(categoryTypeDIKeys.CategoryTypeRepository),
                di.get(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        CreateCategoryTypeUseCase,
        () =>
            new CreateCategoryTypeUseCase(
                di.get(categoryTypeDIKeys.CategoryTypeRepository),
                di.get(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        UpdateCategoryTypeUseCase,
        () =>
            new UpdateCategoryTypeUseCase(
                di.get(categoryTypeDIKeys.CategoryTypeRepository),
                di.get(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        DeleteCategoryTypeUseCase,
        () =>
            new DeleteCategoryTypeUseCase(
                di.get(categoryTypeDIKeys.CategoryTypeRepository),
                di.get(appDIKeys.userRepository)
            )
    );

    di.bindFactory(
        CategoryTypeController,
        () =>
            new CategoryTypeController(
                di.get(appDIKeys.jwtAuthenticator),
                di.get(GetCategoryTypesUseCase),
                di.get(GetCategoryTypeByIdUseCase),
                di.get(CreateCategoryTypeUseCase),
                di.get(UpdateCategoryTypeUseCase),
                di.get(DeleteCategoryTypeUseCase)
            )
    );
}
