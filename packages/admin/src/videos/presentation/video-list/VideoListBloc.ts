import { ListField } from "../../../common/presentation/state/ListState";
import { VideoData } from "karate-stars-core";
import ListBloc, { defaultPagination } from "../../../common/presentation/bloc/ListBloc";
import { DetailPageConfig, pages } from "../../../common/presentation/PageRoutes";
import GetVideosUseCase from "../../domain/GetVideosUseCase";
import DeleteVideoUseCase from "../../domain/DeleteVideoUseCase";
import moment from "moment";

type VideoState = Omit<VideoData, "eventDate"> & { eventDate: string };

class VideoListBloc extends ListBloc<VideoState> {
    constructor(
        private getVideosUseCase: GetVideosUseCase,
        private deleteCompetitorUseCase: DeleteVideoUseCase
    ) {
        super(pages.videoDetail as DetailPageConfig);

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
        const response = await this.getVideosUseCase.execute();

        response.fold(
            error => this.changeState(this.handleError(error)),
            items =>
                this.changeState({
                    kind: "ListLoadedState",
                    items: items.map(item => ({
                        ...item,
                        eventDate: moment(item.eventDate).format("YYYY-MM-DD"),
                    })),
                    fields: fields,
                    selectedItems: [],
                    pagination: { ...defaultPagination, total: items.length },
                    sorting: { field: "title", order: "asc" },
                    actions: this.actions,
                })
        );
    }
}

export default VideoListBloc;

const fields: ListField<VideoState>[] = [
    { name: "id", text: "Id", type: "text" },
    { name: "title", text: "Title", type: "text" },
    { name: "subtitle", text: "Subtitle", type: "text" },
    { name: "description", text: "Description", type: "text" },
    { name: "eventDate", text: "Event date", type: "text" },
];
