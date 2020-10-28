import { ListField } from "../../../common/presentation/state/ListState";
import { NewsFeedRawData } from "karate-stars-core";
import GetNewsFeedsUseCase from "../../domain/GetNewsFeedsUseCase";
import ListBloc from "../../../common/presentation/bloc/ListBloc";

class NewsFeedListBloc extends ListBloc<NewsFeedRawData> {
    constructor(private getNewsFeedsUseCase: GetNewsFeedsUseCase) {
        super();

        this.loadData();
    }

    async search(search: string) {
        this.loadData(search);
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
