import { Bloc } from "../../../common/presentation/bloc";
import { ListField, ListState } from "../../../common/presentation/state/ListState";
import { NewsFeedRawData } from "karate-stars-core";
import GetNewsFeedsUseCase from "../../domain/GetNewsFeedsUseCase";
import { GetNewsFeedsError } from "../../domain/Errors";

class NewsFeedListBloc extends Bloc<ListState<NewsFeedRawData>> {
    constructor(private getNewsFeedsUseCase: GetNewsFeedsUseCase) {
        super({
            kind: "ListLoadingState",
        });

        this.loadData();
    }

    async loadData() {
        const response = await this.getNewsFeedsUseCase.execute();

        response.fold(
            error => this.changeState(this.handleError(error)),
            feeds => this.changeState({ kind: "ListLoadedState", items: feeds, fields: fields })
        );
    }

    private handleError(error: GetNewsFeedsError): ListState<NewsFeedRawData> {
        switch (error.kind) {
            case "Unauthorized": {
                return {
                    kind: "ListErrorState",
                    message: "Invalid credentials",
                };
            }
            case "ApiError": {
                return {
                    kind: "ListErrorState",
                    message: "Sorry, an error has ocurred in the server. Please try later again",
                };
            }
            case "UnexpectedError": {
                return {
                    kind: "ListErrorState",
                    message: "Sorry, an error has ocurred. Please try later again",
                };
            }
        }
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
