import { ListField } from "../../../common/presentation/state/ListState";
import { VideoData } from "karate-stars-core";
import ListBloc, { defaultPagination } from "../../../common/presentation/bloc/ListBloc";
import { DetailPageConfig, pages } from "../../../common/presentation/PageRoutes";
import GetVideosUseCase from "../../domain/GetVideosUseCase";
import DeleteVideoUseCase from "../../domain/DeleteVideoUseCase";

class VideoListBloc extends ListBloc<VideoData> {
    constructor(
        private getVideosUseCase: GetVideosUseCase,
        private deleteCompetitorUseCase: DeleteVideoUseCase
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
        const response = await this.getVideosUseCase.execute();

        response.fold(
            error => this.changeState(this.handleError(error)),
            feeds =>
                this.changeState({
                    kind: "ListLoadedState",
                    items: feeds,
                    fields: fields,
                    selectedItems: [],
                    pagination: { ...defaultPagination, total: feeds.length },
                    sorting: { field: "title", order: "asc" },
                    actions: this.actions,
                })
        );
    }
}

export default VideoListBloc;

const fields: ListField<VideoData>[] = [
    { name: "id", text: "Id", type: "text" },
    { name: "title", text: "Title", type: "text" },
    { name: "subtitle", text: "Subtitle", type: "text" },
    { name: "description", text: "Description", type: "text" },
    { name: "eventDate", text: "Event date", type: "text" },
];
