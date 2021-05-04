import { categoryTypeDIKeys } from "../category-types/CategoryTypeDIModule";
import { MongoConector } from "../common/data/MongoConector";
import { competitorDIKeys } from "../competitors/CompetitorDIModule";
import CompetitorRepository from "../competitors/domain/boundaries/CompetitorRepository";
import { appDIKeys, di } from "../CompositionRoot";
import UserRepository from "../users/domain/boundaries/UserRepository";
import { CategoryController } from "./api/CategoryController";
import CategoryMongoRepository from "./data/CategoryMongoRepository";
import CategoryRepository from "./domain/boundaries/CategoryRepository";
import { CreateCategoryUseCase } from "./domain/usecases/CreateCategoryUseCase";
import { DeleteCategoryUseCase } from "./domain/usecases/DeleteCategoryUseCase";
import { GetCategoriesUseCase } from "./domain/usecases/GetCategoriesUseCase";
import { GetCategoryByIdUseCase } from "./domain/usecases/GetCategoryByIdUseCase";
import { UpdateCategoryUseCase } from "./domain/usecases/UpdateCategoryUseCase";

export const categoryDIKeys = {
    categoryRepository: "categoryRepository",
};

export function initializeCategories() {
    di.bindLazySingleton(
        categoryDIKeys.categoryRepository,
        () => new CategoryMongoRepository(di.get(MongoConector))
    );

    di.bindLazySingleton(
        GetCategoriesUseCase,
        () =>
            new GetCategoriesUseCase(
                di.get<CategoryRepository>(categoryDIKeys.categoryRepository),
                di.get<UserRepository>(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        GetCategoryByIdUseCase,
        () =>
            new GetCategoryByIdUseCase(
                di.get(categoryDIKeys.categoryRepository),
                di.get(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        CreateCategoryUseCase,
        () =>
            new CreateCategoryUseCase(
                di.get(categoryDIKeys.categoryRepository),
                di.get(categoryTypeDIKeys.CategoryTypeRepository),
                di.get(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        UpdateCategoryUseCase,
        () =>
            new UpdateCategoryUseCase(
                di.get(categoryDIKeys.categoryRepository),
                di.get(categoryTypeDIKeys.CategoryTypeRepository),
                di.get(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        DeleteCategoryUseCase,
        () =>
            new DeleteCategoryUseCase(
                di.get(categoryDIKeys.categoryRepository),
                di.get<CompetitorRepository>(competitorDIKeys.CompetitorRepository),
                di.get(appDIKeys.userRepository)
            )
    );

    di.bindFactory(
        CategoryController,
        () =>
            new CategoryController(
                di.get(appDIKeys.jwtAuthenticator),
                di.get(GetCategoriesUseCase),
                di.get(GetCategoryByIdUseCase),
                di.get(CreateCategoryUseCase),
                di.get(UpdateCategoryUseCase),
                di.get(DeleteCategoryUseCase)
            )
    );
}
