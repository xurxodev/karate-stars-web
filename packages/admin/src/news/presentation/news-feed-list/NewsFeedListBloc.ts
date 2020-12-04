import { ListAction, ListField } from "../../../common/presentation/state/ListState";
import { NewsFeedRawData } from "karate-stars-core";
import GetNewsFeedsUseCase from "../../domain/GetNewsFeedsUseCase";
import ListBloc, { defaultPagination } from "../../../common/presentation/bloc/ListBloc";
import { pages } from "../../../common/presentation/PageRoutes";
import DeleteNewsFeedsUseCase from "../../domain/DeleteNewsFeedsUseCase";

class NewsFeedListBloc extends ListBloc<NewsFeedRawData> {
    constructor(
        private getNewsFeedsUseCase: GetNewsFeedsUseCase,
        private deleteNewsFeedsUseCase: DeleteNewsFeedsUseCase
    ) {
        super();

        this.loadData();
    }

    //For the moment local search realized by super class ListBloc
    // async search(search: string) {
    //     this.loadData(search);
    // }

    public actionClick(): void {
        this.changeState({
            kind: "NavigateTo",
            route: pages.newsFeedDetail.generateUrl({ action: "new" }),
        });
    }

    public actionItemClick(actionName: string, id: string): void {
        switch (actionName) {
            case editAction.name: {
                this.changeState({
                    kind: "NavigateTo",
                    route: pages.newsFeedDetail.generateUrl({ id, action: "edit" }),
                });
                break;
            }
            case deleteAction.name: {
                this.delete(id);
                break;
            }
        }
    }
    private async delete(id: string) {
        const response = await this.deleteNewsFeedsUseCase.execute(id);

        response.fold(
            async error => this.changeState(this.handleError(error)),
            () => this.loadData()
        );
    }

    private async loadData(search?: string) {
        const response = await this.getNewsFeedsUseCase.execute(search);

        response.fold(
            error => this.changeState(this.handleError(error)),
            feeds =>
                this.changeState({
                    kind: "ListLoadedState",
                    items: feeds,
                    fields: fields,
                    selectedItems: [],
                    pagination: { ...defaultPagination, total: feeds.length },
                    sorting: { field: "name", order: "asc" },
                    actions,
                })
        );
    }
}

export default NewsFeedListBloc;

const fields: ListField<NewsFeedRawData>[] = [
    { name: "id", text: "Id", type: "text" },
    {
        name: "image",
        text: "Image",
        type: "image",
        sortable: false,
        searchable: false,
    },
    { name: "name", text: "Name", type: "text" },
    { name: "language", text: "Language", type: "text" },
    { name: "type", text: "Type", type: "text" },
    {
        name: "url",
        text: "Url",
        type: "url",
    },
];

const editAction = {
    name: "edit",
    text: "Edit",
    icon: "edit",
    multiple: false,
    primary: true,
    active: true,
};

const deleteAction = {
    name: "delete",
    text: "Delete",
    icon: "delete",
    multiple: true,
    primary: false,
    active: true,
};
const actions: ListAction[] = [editAction, deleteAction];
