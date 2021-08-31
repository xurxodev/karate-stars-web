import {
    FormState,
    FormSectionState,
    statetoData,
    FormChildrenState,
    formChildrenStatetoData,
} from "../../../common/presentation/state/FormState";
import {
    Either,
    CompetitorData,
    Competitor,
    Achievement,
    CountryData,
    CategoryData,
    SocialLinkData,
    AchievementData,
    Id,
    EventData,
    SocialLink,
} from "karate-stars-core";
import { DataError } from "../../../common/domain/Errors";
import DetailBloc, { ValidationBlocError } from "../../../common/presentation/bloc/DetailBloc";
import GetCompetitorByIdUseCase from "../../domain/GetCompetitorByIdUseCase";
import SaveCompetitorUseCase from "../../domain/SaveCompetitorUseCase";
import GetCountriesUseCase from "../../../countries/domain/GetCountriesUseCase";
import GetCategoriesUseCase from "../../../categories/domain/GetCategoriesUseCase";
import GetEventsUseCase from "../../../events/domain/GetEventsUseCase";
import { basicActions } from "../../../common/presentation/bloc/basicActions";

export interface SocialLinkState extends SocialLinkData {
    id: string;
}

export interface AchievementState extends AchievementData {
    id: string;
}

type CompetitorState = Omit<CompetitorData, "links" | "achievements"> & {
    links: SocialLinkState[];
    achievements: AchievementState[];
};

class CompetitorDetailBloc extends DetailBloc<CompetitorState> {
    private countries: CountryData[] = [];
    private categories: CategoryData[] = [];
    private events: EventData[] = [];

    constructor(
        private getCompetitorByIdUseCase: GetCompetitorByIdUseCase,
        private saveCompetitorUseCase: SaveCompetitorUseCase,
        private getCountriesUseCase: GetCountriesUseCase,
        private getCategoriesUseCase: GetCategoriesUseCase,
        private getEventsUseCase: GetEventsUseCase
    ) {
        super("Competitor");
    }

    async init(id?: string) {
        this.countries = (await this.getCountriesUseCase.execute()).fold(
            () => [],
            countries => countries
        );

        this.categories = (await this.getCategoriesUseCase.execute()).fold(
            () => [],
            categories => categories
        );

        this.events = (await this.getEventsUseCase.execute()).fold(
            () => [],
            events => events
        );
        super.init(id);
    }

    protected async getItem(id: string): Promise<Either<DataError, CompetitorState>> {
        const competitorResult = await this.getCompetitorByIdUseCase.execute(id);

        return competitorResult.map(data => {
            return this.mapDataToState(data);
        });
    }

    protected async mapItemToFormSectionsState(
        item?: CompetitorState
    ): Promise<FormSectionState[]> {
        return this.initialFieldsState(this.countries, this.categories, this.events, item);
    }
    protected saveItem(item: CompetitorState): Promise<Either<DataError, true>> {
        const competitor = Competitor.create(item).get();
        return this.saveCompetitorUseCase.execute(competitor);
    }

    protected validateFormState(state: FormState): ValidationBlocError[] | null {
        const data: CompetitorState = statetoData(state);
        const result = Competitor.create(data);
        const errors = result.fold(
            errors => errors,
            () => null
        );

        return errors;
    }

    protected validateChildrenFormState(
        field: keyof CompetitorState,
        state: FormChildrenState
    ): ValidationBlocError[] | null {
        if (field === "links") {
            const result = SocialLink.create(formChildrenStatetoData(state));
            const errors = result.fold(
                errors => errors,
                () => null
            );

            return errors;
        } else if (field === "achievements") {
            const result = Achievement.create(formChildrenStatetoData(state));
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
        field: keyof CompetitorState,
        childrenId?: string,
        item?: CompetitorState
    ): Promise<FormChildrenState> {
        return this.initialChildrenFormState(field, childrenId, item);
    }

    private mapDataToState(data: CompetitorData): CompetitorState {
        const links = data.links.map(
            link => ({ ...link, id: Id.generateId().value } as SocialLinkState)
        );
        const achievements = data.achievements.map(
            achievement =>
                ({
                    ...achievement,
                    id: Id.generateId().value,
                } as AchievementState)
        );

        return { ...data, links, achievements };
    }

    private async initialChildrenFormState(
        field: keyof CompetitorState,
        childrenId?: string,
        item?: CompetitorState
    ): Promise<FormChildrenState> {
        if (field === "links") {
            const socialLink = item?.links.find(link => link.id === childrenId);

            return {
                isValid: false,
                title: "Link",
                fields: [
                    {
                        kind: "FormSingleFieldState",
                        name: "id",
                        label: "Id",
                        value: socialLink?.id,
                        hide: true,
                    },
                    {
                        kind: "FormSingleFieldState",
                        name: "url",
                        label: "Url",
                        value: socialLink?.url,
                        required: true,
                    },
                    {
                        kind: "FormSingleFieldState",
                        name: "type",
                        label: "Type",
                        selectOptions: linkTypeOptions,
                        value: socialLink?.type ?? linkTypeOptions[0].id,
                        required: true,
                    },
                ],
            };
        } else if (field === "achievements") {
            const achievement = item?.achievements.find(link => link.id === childrenId);
            return {
                isValid: false,
                title: "Achievement",
                fields: [
                    {
                        kind: "FormSingleFieldState",
                        name: "id",
                        label: "Id",
                        value: achievement?.id,
                        hide: true,
                    },
                    {
                        kind: "FormSingleFieldState",
                        name: "categoryId",
                        label: "Achievement Category",
                        value: achievement?.categoryId || this.categories[0].id,
                        selectOptions: this.categories,
                        required: true,
                    },
                    {
                        kind: "FormSingleFieldState",
                        name: "eventId",
                        label: "Event",
                        value: achievement?.eventId || this.events[0].id,
                        selectOptions: this.events,
                        required: true,
                    },
                    {
                        kind: "FormSingleFieldState",
                        name: "position",
                        label: "Position",
                        value: achievement?.position.toString(),
                        required: true,
                    },
                ],
            };
        } else {
            throw new Error("Links and achievemtns is the unique children field for competitors");
        }
    }

    private initialFieldsState(
        countries: CountryData[],
        categories: CategoryData[],
        events: EventData[],
        entity?: CompetitorState
    ): FormSectionState[] {
        const countryOptions = countries.map(country => ({
            id: country.id,
            name: country.name,
        }));

        const categoryOptions = categories.map(category => ({
            id: category.id,
            name: category.name,
        }));

        const achievementList = entity?.achievements.map(achievement => {
            const category = categories.find(cat => cat.id === achievement.categoryId)?.name;
            const event = events.find(ev => ev.id === achievement.eventId)?.name;

            return { ...achievement, category, event };
        });

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
                        label: "Image",
                        name: "mainImage",
                        type: "file",
                        imageType: "image",
                        alt: entity ? `${entity.firstName} ${entity.lastName}` : "",
                        value: entity?.mainImage,
                        accept: "image/*",
                    },
                    {
                        kind: "FormSingleFieldState",
                        label: "First Name",
                        name: "firstName",
                        required: true,
                        value: entity?.firstName,
                        md: 4,
                        xs: 12,
                    },
                    {
                        kind: "FormSingleFieldState",
                        label: "Last Name",
                        name: "lastName",
                        required: true,
                        value: entity?.lastName,
                        md: 4,
                        xs: 12,
                    },
                    {
                        kind: "FormSingleFieldState",
                        label: "WKF Id",
                        name: "wkfId",
                        required: true,
                        value: entity?.wkfId,
                        md: 4,
                        xs: 12,
                    },

                    {
                        kind: "FormSingleFieldState",
                        label: "Country",
                        name: "countryId",
                        required: true,
                        value: entity?.countryId || countryOptions[0].id,
                        selectOptions: countryOptions,
                        md: 4,
                        xs: 12,
                    },
                    {
                        kind: "FormSingleFieldState",
                        label: "Category",
                        name: "categoryId",
                        required: true,
                        value: entity?.categoryId || categoryOptions[0].id,
                        selectOptions: categoryOptions,
                        md: 4,
                        xs: 12,
                    },
                    {
                        kind: "FormSingleFieldState",
                        label: "Active",
                        name: "isActive",
                        type: "checkbox",
                        value: entity?.isActive || false,
                        md: 2,
                        xs: 2,
                    },
                    {
                        kind: "FormSingleFieldState",
                        label: "Legend",
                        name: "isLegend",
                        type: "checkbox",
                        value: entity?.isLegend || false,
                        md: 2,
                        xs: 2,
                    },
                    {
                        kind: "FormSingleFieldState",
                        label: "Biography",
                        name: "biography",
                        required: true,
                        value: entity?.biography,
                        md: 12,
                        xs: 12,
                        multiline: true,
                    },
                    {
                        kind: "FormComplexFieldState",
                        listLabel: "Links",
                        name: "links",
                        required: true,
                        addActionLabel: "Add link",
                        list: {
                            fields: [
                                { name: "url", text: "Url", type: "text" },
                                { name: "type", text: "Type", type: "text" },
                            ],
                            items: entity?.links || [],
                            selectedItems: [],
                            searchEnable: false,
                            actions: basicActions,
                        },
                        form: undefined,
                    },
                    {
                        kind: "FormComplexFieldState",
                        listLabel: "Achievements",
                        name: "achievements",
                        required: true,
                        addActionLabel: "Add achievement",
                        list: {
                            fields: [
                                { name: "eventId", text: "Event Id", type: "text", hide: true },
                                {
                                    name: "categoryId",
                                    text: "Category Id",
                                    type: "text",
                                    hide: true,
                                },
                                { name: "event", text: "Event", type: "text" },
                                { name: "category", text: "Category", type: "text" },
                                { name: "position", text: "Position", type: "text" },
                            ],
                            items: achievementList || [],
                            selectedItems: [],
                            searchEnable: false,
                            actions: basicActions,
                        },
                        form: undefined,
                    },
                ],
            },
        ];
    }
}

export default CompetitorDetailBloc;

const linkTypeOptions = [
    { id: "web", name: "web" },
    { id: "twitter", name: "twitter" },
    { id: "facebook", name: "facebook" },
    { id: "instagram", name: "instagram" },
];
