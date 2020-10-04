import { Bloc } from "../../../common/presentation/bloc";
import { ListState } from "./NewsFeedListState";
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
            feeds => this.changeState({ kind: "ListLoadedState", data: feeds })
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
