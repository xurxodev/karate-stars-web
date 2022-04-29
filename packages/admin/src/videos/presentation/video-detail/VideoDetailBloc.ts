import {
    FormState,
    FormSectionState,
    statetoData,
    FormChildrenState,
    formChildrenStatetoData,
} from "../../../common/presentation/state/FormState";
import {
    Video,
    VideoData,
    Either,
    CompetitorData,
    VideoLink,
    Id,
    VideoLinkData,
} from "karate-stars-core";
import { DataError } from "../../../common/domain/Errors";
import DetailBloc, { ValidationBlocError } from "../../../common/presentation/bloc/DetailBloc";
import GetVideoByIdUseCase from "../../domain/GetVideoByIdUseCase";
import SaveVideoUseCase from "../../domain/SaveVideoUseCase";
import GetCompetitorsUseCase from "../../../competitors/domain/GetCompetitorsUseCase";
import moment from "moment";
import { basicActions } from "../../../common/presentation/bloc/basicActions";

export interface VideoLinkState extends VideoLinkData {
    videoLinkId: string;
}

type VideoState = Omit<VideoData, "links"> & {
    links: VideoLinkState[];
};

class VideoDetailBloc extends DetailBloc<VideoState> {
    private competitors: CompetitorData[] = [];

    constructor(
        private getVideoByIdUseCase: GetVideoByIdUseCase,
        private saveVideoUseCase: SaveVideoUseCase,
        private getCompetitorsUseCase: GetCompetitorsUseCase
    ) {
        super("Video");
    }

    async init(id?: string) {
        this.competitors = (await this.getCompetitorsUseCase.execute()).fold(
            () => [],
            competitors => competitors
        );
        super.init(id);
    }

    protected async getItem(id: string): Promise<Either<DataError, VideoState>> {
        const videoResult = await this.getVideoByIdUseCase.execute(id);

        return videoResult.map((data: VideoData) => {
            return this.mapDataToState(data);
        });
    }

    protected async mapItemToFormSectionsState(item?: VideoState): Promise<FormSectionState[]> {
        return initialFieldsState(this.competitors, item);
    }
    protected saveItem(item: VideoState): Promise<Either<DataError, true>> {
        const videoData = {
            ...item,
            links: item.links.map(link => ({ id: link.videoLinkId, type: link.type })),
        };

        return this.saveVideoUseCase.execute(Video.create(videoData).get());
    }

    protected validateFormState(state: FormState): ValidationBlocError[] | null {
        const result = Video.create(statetoData(state));
        const errors = result.fold(
            errors => errors,
            () => null
        );

        return errors;
    }

    protected validateChildrenFormState(
        field: keyof VideoState,
        state: FormChildrenState
    ): ValidationBlocError[] | null {
        if (field === "links") {
            const result = VideoLink.create(formChildrenStatetoData(state));
            const errors = result.fold(
                errors => errors,
                () => null
            );

            return errors;
        } else {
            return null;
        }
    }

    protected async mapItemToFormChildrenState(
        field: keyof VideoState,
        childrenId?: string,
        item?: VideoState
    ): Promise<FormChildrenState> {
        return initialChildrenFormState(field, childrenId, item);
    }

    private mapDataToState(data: VideoData): VideoState {
        const links = data.links.map(
            link => ({ ...link, videoLinkId: link.id, id: Id.generateId().value } as VideoLinkState)
        );

        return { ...data, links };
    }
}

export default VideoDetailBloc;

const linkTypeOptions = [
    { id: "youtube", name: "Youtube" },
    { id: "facebook", name: "Facebook" },
];

const initialChildrenFormState = (
    field: keyof VideoState,
    childrenId?: string,
    item?: VideoState
): FormChildrenState => {
    if (field === "links") {
        const videoLink = item?.links.find(link => link.id === childrenId);
        return {
            isValid: false,
            title: "Link",
            fields: [
                {
                    kind: "FormSingleFieldState",
                    name: "id",
                    label: "Id",
                    value: videoLink?.id ?? Id.generateId().value,
                    required: true,
                    hide: true,
                },
                {
                    kind: "FormSingleFieldState",
                    name: "videoLinkId",
                    label: "Id",
                    value: videoLink?.videoLinkId,
                    required: true,
                },
                {
                    kind: "FormSingleFieldState",
                    name: "type",
                    label: "Type",
                    selectOptions: linkTypeOptions,
                    value: videoLink?.type ?? linkTypeOptions[0].id,
                    required: true,
                },
            ],
        };
    } else {
        throw new Error("Links is the unique children field for video");
    }
};

const initialFieldsState = (
    competitors: CompetitorData[],
    entity?: VideoState
): FormSectionState[] => {
    const competitorOptions = competitors.map(competitor => ({
        id: competitor.id,
        name: `${competitor.firstName} ${competitor.lastName}`,
    }));

    return [
        {
            fields: [
                {
                    kind: "FormSingleFieldState",
                    label: "Id",
                    name: "id",
                    value: entity?.id,
                    hide: true,
                },
                {
                    kind: "FormSingleFieldState",
                    label: "Title",
                    name: "title",
                    required: true,
                    value: entity?.title,
                    md: 4,
                    xs: 12,
                },
                {
                    kind: "FormSingleFieldState",
                    label: "Subtitle",
                    name: "subtitle",
                    required: true,
                    value: entity?.subtitle,
                    md: 4,
                    xs: 12,
                },
                {
                    kind: "FormSingleFieldState",
                    label: "Description",
                    name: "description",
                    required: true,
                    value: entity?.description,
                    md: 4,
                    xs: 12,
                },
                {
                    kind: "FormSingleFieldState",
                    label: "Event Date",
                    name: "eventDate",
                    required: true,
                    type: "date",
                    value: moment(entity?.eventDate).format("YYYY-MM-DD"),
                    md: 4,
                    xs: 12,
                },
                {
                    kind: "FormSingleFieldState",
                    label: "Live",
                    name: "isLive",
                    type: "checkbox",
                    required: false,
                    value: entity?.isLive?.toString() || false,
                    md: 4,
                    xs: 12,
                },
                {
                    kind: "FormSingleFieldState",
                    label: "Order",
                    name: "order",
                    required: true,
                    value: entity?.order?.toString() || "",
                    md: 4,
                    xs: 12,
                },
                {
                    kind: "FormSingleFieldState",
                    label: "Competitors",
                    name: "competitors",
                    required: false,
                    value: entity?.competitors || [],
                    selectOptions: competitorOptions,
                    multiple: true,
                },
                {
                    kind: "FormComplexFieldState",
                    listLabel: "Links",
                    name: "links",
                    required: true,
                    list: {
                        fields: [
                            { name: "videoLinkId", text: "Id", type: "text" },
                            { name: "type", text: "Type", type: "text" },
                        ],
                        items: entity?.links || [],
                        selectedItems: [],
                        searchEnable: false,
                        actions: basicActions,
                    },
                    form: undefined,
                },
            ],
        },
    ];
};
