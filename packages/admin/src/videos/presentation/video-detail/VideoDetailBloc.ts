import {
    FormState,
    FormSectionState,
    statetoData,
} from "../../../common/presentation/state/FormState";
import { Video, VideoData, Either, CompetitorData } from "karate-stars-core";
import { DataError } from "../../../common/domain/Errors";
import DetailBloc, { ValidationBlocError } from "../../../common/presentation/bloc/DetailBloc";
import GetVideoByIdUseCase from "../../domain/GetVideoByIdUseCase";
import SaveVideoUseCase from "../../domain/SaveVideoUseCase";
import GetCompetitorsUseCase from "../../../competitors/domain/GetCompetitorsUseCase";
import moment from "moment";

class VideoDetailBloc extends DetailBloc<VideoData> {
    constructor(
        private getVideoByIdUseCase: GetVideoByIdUseCase,
        private saveVideoUseCase: SaveVideoUseCase,
        private getCompetitorsUseCase: GetCompetitorsUseCase
    ) {
        super("Video");
    }

    protected getItem(id: string): Promise<Either<DataError, VideoData>> {
        return this.getVideoByIdUseCase.execute(id);
    }
    protected async mapItemToFormSectionsState(item?: VideoData): Promise<FormSectionState[]> {
        const competitors = (await this.getCompetitorsUseCase.execute()).fold(
            () => [],
            competitors => competitors
        );

        return initialFieldsState(competitors, item);
    }
    protected saveItem(item: VideoData): Promise<Either<DataError, true>> {
        return this.saveVideoUseCase.execute(Video.create(item).get());
    }

    protected validateFormState(state: FormState): ValidationBlocError[] | null {
        const result = Video.create(statetoData(state));
        const errors = result.fold(
            errors => errors,
            () => null
        );

        return errors;
    }
}

export default VideoDetailBloc;

const initialFieldsState = (
    competitors: CompetitorData[],
    entity?: VideoData
): FormSectionState[] => {
    const competitorOptions = competitors.map(competitor => ({
        id: competitor.id,
        name: `${competitor.firstName} ${competitor.lastName}`,
    }));

    return [
        {
            fields: [
                { label: "Id", name: "id", value: entity?.id, hide: true },
                {
                    label: "Title",
                    name: "title",
                    required: true,
                    value: entity?.title,
                    md: 6,
                    xs: 12,
                },
                {
                    label: "Subtitle",
                    name: "subtitle",
                    required: true,
                    value: entity?.subtitle,
                    md: 6,
                    xs: 12,
                },
                {
                    label: "Description",
                    name: "description",
                    required: true,
                    value: entity?.description,
                },
                {
                    label: "Order",
                    name: "order",
                    required: true,
                    value: entity?.order.toString(),
                    md: 6,
                    xs: 12,
                },
                {
                    label: "Event Date",
                    name: "eventDate",
                    required: true,
                    type: "date",
                    value: moment(entity?.eventDate).format("YYYY-MM-DD"),
                    md: 6,
                    xs: 12,
                },
                {
                    label: "Competitors",
                    name: "competitors",
                    required: true,
                    value: entity?.competitors,
                    selectOptions: competitorOptions,
                    multiple: true,
                    md: 6,
                    xs: 12,
                },
            ],
        },
    ];
};
