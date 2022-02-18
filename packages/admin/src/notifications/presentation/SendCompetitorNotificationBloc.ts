import {
    FormState,
    FormSectionState,
    statetoData,
} from "../../common/presentation/state/FormState";
import {
    COMPETITOR_NEWS_TOPIC,
    DEBUG_COMPETITOR_NEWS_TOPIC,
} from "../domain/entities/Notification";
import SendPushNotificationUseCase from "../domain/SendPushNotificationUseCase";
import { CompetitorData, Either, ValidationError } from "karate-stars-core";
import { CompetitorNotification } from "../domain/entities/CompetitorNotification";
import SendNotificationBloc from "./SendNotificationBloc";
import GetCompetitorsUseCase from "../../competitors/domain/GetCompetitorsUseCase";

class SendCompetitorNotificationBloc extends SendNotificationBloc<CompetitorNotification> {
    competitors: CompetitorData[] = [];

    constructor(
        sendPushNotificationUseCase: SendPushNotificationUseCase,
        private getCompetitorsUseCase: GetCompetitorsUseCase
    ) {
        super(sendPushNotificationUseCase, {
            isValid: false,
            sections: initialFieldsState([]),
        });

        this.init();
    }

    private async init() {
        this.competitors = (await this.getCompetitorsUseCase.execute()).fold(
            () => [],
            competitors => competitors
        );

        this.changeState({ ...this.state, sections: initialFieldsState(this.competitors) });
    }

    onFieldChanged(name: string, value: string | string[] | boolean) {
        super.onFieldChanged(name, value);

        if (name === "competitorId") {
            const competitor = this.competitors.find(competitor => competitor.id === value);

            if (competitor) {
                super.onFieldChanged(
                    "description",
                    `${competitor.firstName} ${competitor.lastName}`
                );
            }
        }
    }

    protected createNotification(
        state: FormState
    ): Either<ValidationError<CompetitorNotification>[], CompetitorNotification> {
        return CompetitorNotification.create(statetoData(state));
    }
}

export default SendCompetitorNotificationBloc;

const initialFieldsState = (competitors: CompetitorData[]): FormSectionState[] => {
    const competitorOptions = competitors.map(competitor => ({
        id: competitor.id,
        name: `${competitor.firstName} ${competitor.lastName}`,
    }));

    return [
        {
            fields: [
                {
                    kind: "FormSingleFieldState",
                    label: "Topic",
                    name: "topic",
                    value: DEBUG_COMPETITOR_NEWS_TOPIC,
                    selectOptions: [
                        { id: DEBUG_COMPETITOR_NEWS_TOPIC, name: "Debug" },
                        { id: COMPETITOR_NEWS_TOPIC, name: "Real" },
                    ],
                    md: 6,
                    xs: 12,
                    required: true,
                },
                {
                    kind: "FormSingleFieldState",
                    label: "Competitor",
                    name: "competitorId",
                    md: 6,
                    xs: 12,
                    value: competitorOptions[0]?.id,
                    selectOptions: competitorOptions,
                    required: true,
                },
                {
                    kind: "FormSingleFieldState",
                    label: "Title",
                    name: "title",
                    required: true,
                    value: "Karate Stars - new competitor",
                    md: 6,
                    xs: 12,
                },
                {
                    kind: "FormSingleFieldState",
                    label: "Description",
                    name: "description",
                    required: true,
                    md: 6,
                    xs: 12,
                },
            ],
        },
    ];
};
