import { ListField } from "../../../common/presentation/state/ListState";
import { CompetitorData } from "karate-stars-core";
import ListBloc, { defaultPagination } from "../../../common/presentation/bloc/ListBloc";
import { DetailPageConfig, pages } from "../../../common/presentation/PageRoutes";
import GetCompetitorsUseCase from "../../domain/GetCompetitorsUseCase";
import DeleteCompetitorUseCase from "../../domain/DeleteCompetitorUseCase";

class NewsFeedListBloc extends ListBloc<CompetitorData> {
    constructor(
        private getCompetitorsUseCase: GetCompetitorsUseCase,
        private deleteCompetitorUseCase: DeleteCompetitorUseCase
    ) {
        super(pages.competitorDetail as DetailPageConfig);

        this.loadData();
    }

    async confirmDelete() {
        if (this.state.kind === "ListLoadedState" && this.state.itemsToDelete) {
            const response = await this.deleteCompetitorUseCase.execute(
                this.state.itemsToDelete[0]
            );

            response.fold(
                async error => this.changeState({ ...this.handleError(error) }),
                () => this.loadData()
            );
        }
    }

    private async loadData() {
        const response = await this.getCompetitorsUseCase.execute();

        response.fold(
            error => this.changeState(this.handleError(error)),
            feeds =>
                this.changeState({
                    kind: "ListLoadedState",
                    items: feeds,
                    fields: fields,
                    selectedItems: [],
                    pagination: { ...defaultPagination, total: feeds.length },
                    sorting: { field: "lastName", order: "asc" },
                    actions: this.actions,
                })
        );
    }
}

export default NewsFeedListBloc;

const fields: ListField<CompetitorData>[] = [
    { name: "id", text: "Id", type: "text" },
    {
        name: "mainImage",
        text: "Image",
        type: "image",
        alt: "lastName",
        sortable: false,
        searchable: false,
    },
    { name: "lastName", text: "Last Name", type: "text" },
    { name: "firstName", text: "First Name", type: "text" },
    { name: "wkfId", text: "WKF Id", type: "text" },
    { name: "isActive", text: "Is Active", type: "boolean", searchable: false },
    { name: "isLegend", text: "Is Legend", type: "boolean", searchable: false },
];
