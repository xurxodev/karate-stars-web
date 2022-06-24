import { ListField } from "../../../common/presentation/state/ListState";
import { CategoryData } from "karate-stars-core";
import ListBloc, { defaultPagination } from "../../../common/presentation/bloc/ListBloc";
import { DetailPageConfig, pages } from "../../../common/presentation/PageRoutes";
import GetCategorysUseCase from "../../domain/GetCategoriesUseCase";
import DeleteCategoryUseCase from "../../domain/DeleteCategoryUseCase";

class CategoryListBloc extends ListBloc<CategoryData> {
    constructor(
        private getCategorysUseCase: GetCategorysUseCase,
        private deleteCategoryUseCase: DeleteCategoryUseCase
    ) {
        super(pages.categoryDetail as DetailPageConfig);

        this.loadData();
    }

    async confirmDelete() {
        if (this.state.kind === "ListLoadedState" && this.state.itemsToDelete) {
            const response = await this.deleteCategoryUseCase.execute(this.state.itemsToDelete[0]);

            response.fold(
                async error => this.changeState({ ...this.handleError(error) }),
                () => this.loadData()
            );
        }
    }

    private async loadData() {
        const response = await this.getCategorysUseCase.execute();

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

export default CategoryListBloc;

const fields: ListField<CategoryData>[] = [
    { name: "id", text: "Id", type: "text" },
    { name: "name", text: "Name", type: "text" },
    { name: "wkfId", text: "Wkf Id", type: "text" },
    { name: "paraKarate", text: "ParaKarate", type: "boolean", searchable: false },
    { name: "main", text: "Main", type: "boolean", searchable: false },
];
