import { di, appDIKeys } from "../CompositionRoot";
import CategoryTypeApiRepository from "./data/CategoryTypeApiRepository";
import { CategoryTypeRepository } from "./domain/Boundaries";
import DeleteCategoryTypeUseCase from "./domain/DeleteCategoryTypeUseCase";
import GetCategoryTypeByIdUseCase from "./domain/GetCategoryTypeByIdUseCase";
import GetCategoryTypesUseCase from "./domain/GetCategoryTypesUseCase";
import SaveCategoryTypeUseCase from "./domain/SaveCategoryTypeUseCase";
import CategoryTypeDetailBloc from "./presentation/category-type-detail/CategoryTypeDetailBloc";
import CategoryTypeListBloc from "./presentation/category-type-list/CategoryTypeListBloc";

export const CategoryTypeDIKeys = {
    categoryTypeRepository: "categoryTypeRepository",
};

export function initCategoryTypes() {
    di.bindLazySingleton(
        CategoryTypeDIKeys.categoryTypeRepository,
        () =>
            new CategoryTypeApiRepository(
                di.get(appDIKeys.axiosInstanceAPI),
                di.get(appDIKeys.tokenStorage)
            )
    );

    di.bindLazySingleton(
        GetCategoryTypesUseCase,
        () =>
            new GetCategoryTypesUseCase(
                di.get<CategoryTypeRepository>(CategoryTypeDIKeys.categoryTypeRepository)
            )
    );

    di.bindLazySingleton(
        GetCategoryTypeByIdUseCase,
        () =>
            new GetCategoryTypeByIdUseCase(
                di.get<CategoryTypeRepository>(CategoryTypeDIKeys.categoryTypeRepository)
            )
    );

    di.bindLazySingleton(
        SaveCategoryTypeUseCase,
        () =>
            new SaveCategoryTypeUseCase(
                di.get<CategoryTypeRepository>(CategoryTypeDIKeys.categoryTypeRepository)
            )
    );

    di.bindLazySingleton(
        DeleteCategoryTypeUseCase,
        () =>
            new DeleteCategoryTypeUseCase(
                di.get<CategoryTypeRepository>(CategoryTypeDIKeys.categoryTypeRepository)
            )
    );

    di.bindFactory(
        CategoryTypeListBloc,
        () =>
            new CategoryTypeListBloc(
                di.get(GetCategoryTypesUseCase),
                di.get(DeleteCategoryTypeUseCase)
            )
    );

    di.bindFactory(
        CategoryTypeDetailBloc,
        () =>
            new CategoryTypeDetailBloc(
                di.get(GetCategoryTypeByIdUseCase),
                di.get(SaveCategoryTypeUseCase)
            )
    );
}
