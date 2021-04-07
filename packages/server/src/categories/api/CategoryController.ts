import { GetCategoriesUseCase } from "../domain/usecases/GetCategoriesUseCase";
import { JwtAuthenticator } from "../../server";
import { Either, CategoryData } from "karate-stars-core";
import { AdminController, UseCaseErrors } from "../../common/api/AdminController";
import { GetCategoryByIdUseCase } from "../domain/usecases/GetCategoryByIdUseCase";
import { CreateCategoryUseCase } from "../domain/usecases/CreateCategoryUseCase";
import { ActionResult } from "../../common/api/ActionResult";
import { UpdateCategoryUseCase } from "../domain/usecases/UpdateCategoryUseCase";
import { DeleteCategoryUseCase } from "../domain/usecases/DeleteCategoryUseCase";

export class CategoryController extends AdminController<CategoryData> {
    constructor(
        jwtAuthenticator: JwtAuthenticator,
        private getCategoriesUseCase: GetCategoriesUseCase,
        private getCategoryByIdUseCase: GetCategoryByIdUseCase,
        private createCategoryUseCase: CreateCategoryUseCase,
        private updateCategoryUseCase: UpdateCategoryUseCase,
        private deleteCategoryUseCase: DeleteCategoryUseCase
    ) {
        super(jwtAuthenticator);
    }

    protected runGetAll(userId: any): Promise<Either<UseCaseErrors<CategoryData>, CategoryData[]>> {
        return this.getCategoriesUseCase.execute({ userId });
    }

    protected runGet(
        userId: any,
        id: string
    ): Promise<Either<UseCaseErrors<CategoryData>, CategoryData>> {
        return this.getCategoryByIdUseCase.execute({ userId, id });
    }

    protected runPost(
        userId: string,
        data: CategoryData
    ): Promise<Either<UseCaseErrors<CategoryData>, ActionResult>> {
        return this.createCategoryUseCase.execute({ userId, data });
    }

    protected runPut(
        userId: string,
        itemId: string,
        data: CategoryData
    ): Promise<Either<UseCaseErrors<CategoryData>, ActionResult>> {
        return this.updateCategoryUseCase.execute({ userId, data, itemId });
    }

    protected runDelete(
        userId: string,
        id: string
    ): Promise<Either<UseCaseErrors<CategoryData>, ActionResult>> {
        return this.deleteCategoryUseCase.execute({ userId, id });
    }
}
