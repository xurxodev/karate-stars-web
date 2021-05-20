import { ListField } from "../../../common/presentation/state/ListState";
import { EventData } from "karate-stars-core";
import ListBloc, { defaultPagination } from "../../../common/presentation/bloc/ListBloc";
import { DetailPageConfig, pages } from "../../../common/presentation/PageRoutes";
import GetEventsUseCase from "../../domain/GetEventsUseCase";
import DeleteEventUseCase from "../../domain/DeleteEventUseCase";

class EventListBloc extends ListBloc<EventData> {
    constructor(
        private getEventsUseCase: GetEventsUseCase,
        private deleteEventUseCase: DeleteEventUseCase
    ) {
        super(pages.eventDetail as DetailPageConfig);

        this.loadData();
    }

    async confirmDelete() {
        if (this.state.kind === "ListLoadedState" && this.state.itemsToDelete) {
            const response = await this.deleteEventUseCase.execute(this.state.itemsToDelete[0]);

            response.fold(
                async error => this.changeState({ ...this.handleError(error) }),
                () => this.loadData()
            );
        }
    }

    private async loadData() {
        const response = await this.getEventsUseCase.execute();

        response.fold(
            error => this.changeState(this.handleError(error)),
            items =>
                this.changeState({
                    kind: "ListLoadedState",
                    items,
                    fields: fields,
                    selectedItems: [],
                    pagination: { ...defaultPagination, total: items.length },
                    sorting: { field: "year", order: "desc" },
                    actions: this.actions,
                })
        );
    }
}

export default EventListBloc;

const fields: ListField<EventData>[] = [
    { name: "id", text: "Id", type: "text" },
    { name: "name", text: "Name", type: "text" },
    { name: "year", text: "Year", type: "text" },
];
