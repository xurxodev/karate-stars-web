import { GetCategoryTypesUseCase } from "../domain/usecases/GetCategoryTypesUseCase";
import { JwtAuthenticator } from "../../server";
import { Either, CategoryTypeData } from "karate-stars-core";
import { AdminController, UseCaseErrors } from "../../common/api/AdminController";
import { GetCategoryTypeByIdUseCase } from "../domain/usecases/GetCategoryTypeByIdUseCase";
import { CreateCategoryTypeUseCase } from "../domain/usecases/CreateCategoryTypeUseCase";
import { ActionResult } from "../../common/api/ActionResult";
import { UpdateCategoryTypeUseCase } from "../domain/usecases/UpdateCategoryTypeUseCase";
import { DeleteCategoryTypeUseCase } from "../domain/usecases/DeleteCategoryTypeUseCase";

export class CategoryTypeController extends AdminController<CategoryTypeData> {
    constructor(
        jwtAuthenticator: JwtAuthenticator,
        private getCategoryTypesUseCase: GetCategoryTypesUseCase,
        private getCategoryTypeByIdUseCase: GetCategoryTypeByIdUseCase,
        private createCategoryTypeUseCase: CreateCategoryTypeUseCase,
        private updateCategoryTypeUseCase: UpdateCategoryTypeUseCase,
        private deleteCategoryTypeUseCase: DeleteCategoryTypeUseCase
    ) {
        super(jwtAuthenticator);
    }

    protected runGetAll(
        userId: any
    ): Promise<Either<UseCaseErrors<CategoryTypeData>, CategoryTypeData[]>> {
        return this.getCategoryTypesUseCase.execute({ userId });
    }

    protected runGet(
        userId: any,
        id: string
    ): Promise<Either<UseCaseErrors<CategoryTypeData>, CategoryTypeData>> {
        return this.getCategoryTypeByIdUseCase.execute({ userId, id });
    }

    protected runPost(
        userId: string,
        data: CategoryTypeData
    ): Promise<Either<UseCaseErrors<CategoryTypeData>, ActionResult>> {
        return this.createCategoryTypeUseCase.execute({ userId, data });
    }

    protected runPut(
        userId: string,
        itemId: string,
        data: CategoryTypeData
    ): Promise<Either<UseCaseErrors<CategoryTypeData>, ActionResult>> {
        return this.updateCategoryTypeUseCase.execute({ userId, data, itemId });
    }

    protected runDelete(
        userId: string,
        id: string
    ): Promise<Either<UseCaseErrors<CategoryTypeData>, ActionResult>> {
        return this.deleteCategoryTypeUseCase.execute({ userId, id });
    }
}
