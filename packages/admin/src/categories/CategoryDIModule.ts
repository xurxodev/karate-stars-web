import { di, appDIKeys } from "../CompositionRoot";
import CategoryApiRepository from "./data/CategoryApiRepository";
import { CategoryRepository } from "./domain/Boundaries";
import DeleteCategoryUseCase from "./domain/DeleteCategoryUseCase";
import GetCategoryByIdUseCase from "./domain/GetCategoryByIdUseCase";
import GetCategorysUseCase from "./domain/GetCategoryUseCase";
import SaveCategoryUseCase from "./domain/SaveCategoryUseCase";
import CategoryListBloc from "./presentation/category-list/CategoryListBloc";

export const CategoryDIKeys = {
    categoryRepository: "categoryRepository",
};

export function initCategories() {
    di.bindLazySingleton(
        CategoryDIKeys.categoryRepository,
        () =>
            new CategoryApiRepository(
                di.get(appDIKeys.axiosInstanceAPI),
                di.get(appDIKeys.tokenStorage)
            )
    );

    di.bindLazySingleton(
        GetCategorysUseCase,
        () => new GetCategorysUseCase(di.get<CategoryRepository>(CategoryDIKeys.categoryRepository))
    );

    di.bindLazySingleton(
        GetCategoryByIdUseCase,
        () =>
            new GetCategoryByIdUseCase(
                di.get<CategoryRepository>(CategoryDIKeys.categoryRepository)
            )
    );

    di.bindLazySingleton(
        SaveCategoryUseCase,
        () => new SaveCategoryUseCase(di.get<CategoryRepository>(CategoryDIKeys.categoryRepository))
    );

    di.bindLazySingleton(
        DeleteCategoryUseCase,
        () =>
            new DeleteCategoryUseCase(di.get<CategoryRepository>(CategoryDIKeys.categoryRepository))
    );

    di.bindFactory(
        CategoryListBloc,
        () => new CategoryListBloc(di.get(GetCategorysUseCase), di.get(DeleteCategoryUseCase))
    );

    // di.bindFactory(
    //     NewsFeedDetailBloc,
    //     () => new NewsFeedDetailBloc(di.get(GetNewsFeedByIdUseCase), di.get(SaveNewsFeedUseCase))
    // );
}
