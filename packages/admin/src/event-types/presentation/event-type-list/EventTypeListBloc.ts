import { ListField } from "../../../common/presentation/state/ListState";
import { EventTypeData } from "karate-stars-core";
import ListBloc, { defaultPagination } from "../../../common/presentation/bloc/ListBloc";
import { DetailPageConfig, pages } from "../../../common/presentation/PageRoutes";
import GetEventTypesUseCase from "../../domain/GetEventTypesUseCase";
import DeleteEventTypeUseCase from "../../domain/DeleteEventTypeUseCase";

class EventTypeListBloc extends ListBloc<EventTypeData> {
    constructor(
        private getEventTypesUseCase: GetEventTypesUseCase,
        private deleteEventTypeUseCase: DeleteEventTypeUseCase
    ) {
        super(pages.eventTypeDetail as DetailPageConfig);

        this.loadData();
    }

    async confirmDelete() {
        if (this.state.kind === "ListLoadedState" && this.state.itemsToDelete) {
            const response = await this.deleteEventTypeUseCase.execute(this.state.itemsToDelete[0]);

            response.fold(
                async error => this.changeState({ ...this.handleError(error) }),
                () => this.loadData()
            );
        }
    }

    private async loadData() {
        const response = await this.getEventTypesUseCase.execute();

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

export default EventTypeListBloc;

const fields: ListField<EventTypeData>[] = [
    { name: "id", text: "Id", type: "text" },
    { name: "name", text: "Name", type: "text" },
];
