import {
    FormState,
    FormSectionState,
    statetoData,
} from "../../../common/presentation/state/FormState";
import {
    Category,
    CategoryData,
    CategoryTypeData,
    Either,
    ValidationError,
} from "karate-stars-core";
import { DataError } from "../../../common/domain/Errors";
import DetailBloc from "../../../common/presentation/bloc/DetailBloc";
import GetCategoryByIdUseCase from "../../domain/GetCategoryByIdUseCase";
import SaveCategoryUseCase from "../../domain/SaveCategoryUseCase";
import GetCategoryTypesUseCase from "../../../category-types/domain/GetCategoryTypesUseCase";

class CategoryDetailBloc extends DetailBloc<CategoryData> {
    constructor(
        private getCategoryByIdUseCase: GetCategoryByIdUseCase,
        private saveCategoryUseCase: SaveCategoryUseCase,
        private getCategoryTypesUseCase: GetCategoryTypesUseCase
    ) {
        super("Category");
    }

    protected getItem(id: string): Promise<Either<DataError, CategoryData>> {
        return this.getCategoryByIdUseCase.execute(id);
    }
    protected async mapItemToFormSectionsState(item?: CategoryData): Promise<FormSectionState[]> {
        const categoryTypes = (await this.getCategoryTypesUseCase.execute()).fold(
            () => [],
            types => types
        );

        return initialFieldsState(categoryTypes, item);
    }
    protected saveItem(item: CategoryData): Promise<Either<DataError, true>> {
        return this.saveCategoryUseCase.execute(Category.create(item).get());
    }

    protected validateFormState(state: FormState): ValidationError<CategoryData>[] | null {
        const result = Category.create(statetoData(state));
        const errors = result.fold(
            errors => errors,
            () => null
        );

        return errors;
    }
}

export default CategoryDetailBloc;

const initialFieldsState = (
    categoryTypes: CategoryTypeData[],
    entity?: CategoryData
): FormSectionState[] => {
    const typeOptions = categoryTypes.map(type => ({ id: type.id, name: type.name }));

    return [
        {
            fields: [
                {
                    kind: "FormSingleFieldState",
                    label: "Id",
                    name: "id",
                    value: entity?.id,
                    hide: true,
                },
                {
                    kind: "FormSingleFieldState",
                    label: "Name",
                    name: "name",
                    required: true,
                    value: entity?.name,
                    md: 6,
                    xs: 12,
                },
                {
                    kind: "FormSingleFieldState",
                    label: "Type",
                    name: "typeId",
                    required: true,
                    value: entity?.typeId ?? typeOptions[0].id,
                    selectOptions: typeOptions,
                    md: 6,
                    xs: 12,
                },
            ],
        },
    ];
};
