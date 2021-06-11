import { ListField } from "../../../common/presentation/state/ListState";
import { CategoryTypeData } from "karate-stars-core";
import ListBloc, { defaultPagination } from "../../../common/presentation/bloc/ListBloc";
import { DetailPageConfig, pages } from "../../../common/presentation/PageRoutes";
import GetCategoryTypesUseCase from "../../domain/GetCategoryTypesUseCase";
import DeleteCategoryTypeUseCase from "../../domain/DeleteCategoryTypeUseCase";

class CategoryTypeListBloc extends ListBloc<CategoryTypeData> {
    constructor(
        private getCategoryTypesUseCase: GetCategoryTypesUseCase,
        private deleteCategoryTypeUseCase: DeleteCategoryTypeUseCase
    ) {
        super(pages.categoryTypeDetail as DetailPageConfig);

        this.loadData();
    }

    async confirmDelete() {
        if (this.state.kind === "ListLoadedState" && this.state.itemsToDelete) {
            const response = await this.deleteCategoryTypeUseCase.execute(
                this.state.itemsToDelete[0]
            );

            response.fold(
                async error => this.changeState({ ...this.handleError(error) }),
                () => this.loadData()
            );
        }
    }

    private async loadData() {
        const response = await this.getCategoryTypesUseCase.execute();

        response.fold(
            error => this.changeState(this.handleError(error)),
            items =>
                this.changeState({
                    kind: "ListLoadedState",
                    items,
                    fields: fields,
                    selectedItems: [],
                    pagination: { ...defaultPagination, total: items.length },
                    sorting: { field: "name", order: "asc" },
                    actions: this.actions,
                })
        );
    }
}

export default CategoryTypeListBloc;

const fields: ListField<CategoryTypeData>[] = [
    { name: "id", text: "Id", type: "text" },
    { name: "name", text: "Name", type: "text" },
];
