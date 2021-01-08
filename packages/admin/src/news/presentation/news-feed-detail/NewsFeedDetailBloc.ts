import {
    FormState,
    FormSectionState,
    stateToRawData,
} from "../../../common/presentation/state/FormState";
import FormBloc from "../../../common/presentation/bloc/FormBloc";
import {
    Either,
    NewsFeed,
    NewsFeedRawData,
    ValidationErrorKey,
    ValidationErrorsDictionary,
} from "karate-stars-core";
import GetNewsFeedByIdUseCase from "../../domain/GetNewsFeedByIdUseCase";
import { DataError } from "../../../common/domain/Errors";
import SaveNewsFeedUseCase from "../../domain/SaveNewsFeedUseCase";

class NewsFeedDetailBloc extends FormBloc {
    constructor(
        private getNewsFeedByIdUseCase: GetNewsFeedByIdUseCase,
        private saveNewsFeedUseCase: SaveNewsFeedUseCase
    ) {
        super({
            submitName: "Accept",
            isValid: false,
            showCancel: true,
            sections: initialFieldsState(),
        });
    }

    async init(id?: string) {
        if (id) {
            const newsFeedResult = await this.getNewsFeedByIdUseCase.execute(id);

            newsFeedResult.fold(
                error => this.changeState(this.handleError(error)),
                newsFeed => {
                    this.changeState({
                        ...this.state,
                        sections: initialFieldsState(newsFeed),
                    });
                }
            );
        }
    }

    private handleError(error: DataError): FormState {
        switch (error.kind) {
            case "Unauthorized":
                return {
                    ...this.state,
                    result: { kind: "FormResultError", message: "Invalid credentials" },
                };
            case "ApiError":
                return {
                    ...this.state,
                    result: {
                        kind: "FormResultError",
                        message: `Sorry, an error has ocurred in the server. Please try later again`,
                    },
                };
            case "UnexpectedError":
                return {
                    ...this.state,
                    result: {
                        kind: "FormResultError",
                        message: `Sorry, an error has ocurred. Please try later again`,
                    },
                };
        }
    }

    protected validateState(state: FormState): Record<string, ValidationErrorKey[]> | null {
        const result = this.mapStateToEntity(state);
        const errors = result.fold(
            errors => errors,
            () => null
        );

        return errors;
    }

    async submit() {
        if (this.state.isValid) {
            const entityResult = this.mapStateToEntity(this.state);
            const sendResult = await this.saveNewsFeedUseCase.execute(entityResult.getOrThrow());

            sendResult.fold(
                (error: DataError) => this.changeState(this.handleError(error)),
                () =>
                    this.changeState({
                        ...this.state,
                        result: {
                            kind: "FormResultSuccess",
                            message: "News feed saved!",
                        },
                    })
            );
        } else {
            this.changeState({ ...this.state });
        }
    }

    private mapStateToEntity(state: FormState): Either<ValidationErrorsDictionary, NewsFeed> {
        const rawData = (stateToRawData(state) as unknown) as NewsFeedRawData;

        return NewsFeed.create(rawData);
    }
}

export default NewsFeedDetailBloc;

const initialFieldsState = (newsFeed?: NewsFeedRawData): FormSectionState[] => {
    return [
        {
            fields: [
                { label: "Id", name: "id", value: newsFeed?.id, hide: true },
                {
                    label: "Image",
                    name: "image",
                    type: "file",
                    alt: newsFeed?.name,
                    value: newsFeed?.image,
                    accept: "image/*",
                },
                { label: "Name", name: "name", required: true, value: newsFeed?.name },
                { label: "Url", name: "url", required: true, value: newsFeed?.url },
                {
                    label: "Language",
                    name: "language",
                    required: true,
                    value: newsFeed?.language,
                    md: 6,
                    xs: 12,
                },
                {
                    label: "Type",
                    name: "type",
                    value: "rss",
                    selectOptions: [
                        { id: "rss", name: "RSS" },
                        { id: "atom", name: "Atom" },
                    ],
                    md: 6,
                    xs: 12,
                    required: true,
                },
            ],
        },
    ];
};
