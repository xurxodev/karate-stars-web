import {
    FormState,
    FormSectionState,
    statetoData,
} from "../../../common/presentation/state/FormState";
import { Either, NewsFeed, NewsFeedData, ValidationError } from "karate-stars-core";
import GetNewsFeedByIdUseCase from "../../domain/GetNewsFeedByIdUseCase";
import { DataError } from "../../../common/domain/Errors";
import SaveNewsFeedUseCase from "../../domain/SaveNewsFeedUseCase";
import DetailBloc from "../../../common/presentation/bloc/DetailBloc";

class NewsFeedDetailBloc extends DetailBloc<NewsFeedData> {
    constructor(
        private getNewsFeedByIdUseCase: GetNewsFeedByIdUseCase,
        private saveNewsFeedUseCase: SaveNewsFeedUseCase
    ) {
        super("News feed");
    }

    protected getItem(id: string): Promise<Either<DataError, NewsFeedData>> {
        return this.getNewsFeedByIdUseCase.execute(id);
    }
    protected async mapItemToFormSectionsState(item: NewsFeedData): Promise<FormSectionState[]> {
        return initialFieldsState(item);
    }
    protected saveItem(item: NewsFeedData): Promise<Either<DataError, true>> {
        return this.saveNewsFeedUseCase.execute(NewsFeed.create(item).get());
    }

    protected validateFormState(state: FormState): ValidationError<NewsFeedData>[] | null {
        const result = NewsFeed.create(statetoData(state));
        const errors = result.fold(
            errors => errors,
            () => null
        );

        return errors;
    }
}

export default NewsFeedDetailBloc;

const initialFieldsState = (newsFeed?: NewsFeedData): FormSectionState[] => {
    return [
        {
            fields: [
                {
                    kind: "FormSingleFieldState",
                    label: "Id",
                    name: "id",
                    value: newsFeed?.id,
                    hide: true,
                },
                {
                    kind: "FormSingleFieldState",
                    label: "Image",
                    name: "image",
                    type: "file",
                    alt: newsFeed?.name,
                    value: newsFeed?.image,
                    accept: "image/*",
                },
                {
                    kind: "FormSingleFieldState",
                    label: "Name",
                    name: "name",
                    required: true,
                    value: newsFeed?.name,
                },
                {
                    kind: "FormSingleFieldState",
                    label: "Url",
                    name: "url",
                    required: true,
                    value: newsFeed?.url,
                },
                {
                    kind: "FormSingleFieldState",
                    label: "Language",
                    name: "language",
                    required: true,
                    value: newsFeed?.language,
                    md: 6,
                    xs: 12,
                },
                {
                    kind: "FormSingleFieldState",
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
