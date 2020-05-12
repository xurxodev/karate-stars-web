
import GetCurrentUserUseCase from "../user/domain/GetCurrentUserUseCase";
import RemoveCurrentUserUseCase from "../user/domain/RemoveCurrentUserUseCase";
import Bloc from "../common/presentation/bloc";
import AppState from "./AppState"
import { UserError } from "../user/domain/Errors";


class AppBloc extends Bloc<AppState>{


    constructor(
        private getCurrentUserUseCase: GetCurrentUserUseCase,
        private removeCurrentUserUseCase: RemoveCurrentUserUseCase) {
        super({ currentUserId: undefined, isAuthenticated: undefined })

        this.loadState();
    }

    private async loadState() {

        const result = await this.getCurrentUserUseCase.execute();

        result.fold(
            (error) => this.changeState(this.handleError(error)),
            (user) => this.changeState({ currentUserId: user.userId, isAuthenticated: true }));
    }

    refresh() {
        this.changeState({ ...this.getState, currentUserId: undefined, isAuthenticated: undefined });
        this.loadState()
    }

    async logout() {
        await this.removeCurrentUserUseCase.execute();

        this.changeState({ ...this.getState, currentUserId: undefined, isAuthenticated: false });
    }

    //TODO- Review this
    private handleError(error: UserError): AppState {
        switch (error.kind) {
            case "Unauthorized": return { ...this.getState, currentUserId: undefined, isAuthenticated: false };
            case "ApiError": return { ...this.getState, currentUserId: undefined, isAuthenticated: false };
            case "UnexpectedError": return { ...this.getState, currentUserId: undefined, isAuthenticated: false }
        };
    }
}

export default AppBloc;