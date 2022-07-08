import {
    FormState,
    FormSectionState,
    statetoData,
} from "../../common/presentation/state/FormState";
import { DEBUG_RANKING_NEWS_TOPIC, RANKING_NEWS_TOPIC } from "../domain/entities/Notification";
import SendPushNotificationUseCase from "../domain/SendPushNotificationUseCase";
import { Either, RankingData, ValidationError } from "karate-stars-core";
import SendNotificationBloc from "./SendNotificationBloc";
import GetRankingsUseCase from "../../rankings/domain/GetRankingsUseCase";
import { RankingNotification } from "../domain/entities/RankingNotification";

class SendRankingNotificationBloc extends SendNotificationBloc<RankingNotification> {
    rankings: RankingData[] = [];

    constructor(
        sendPushNotificationUseCase: SendPushNotificationUseCase,
        private getRankingsUseCase: GetRankingsUseCase
    ) {
        super(sendPushNotificationUseCase, {
            isValid: false,
            sections: initialFieldsState([]),
        });
        this.init();
    }

    private async init() {
        this.rankings = (await this.getRankingsUseCase.execute()).fold(
            () => [],
            rankings => rankings
        );

        this.changeState({ ...this.state, sections: initialFieldsState(this.rankings) });
    }

    onFieldChanged(name: string, value: string | string[] | boolean) {
        super.onFieldChanged(name, value);

        if (name === "rankingId") {
            const ranking = this.rankings.find(ranking => ranking.id === value);

            if (ranking) {
                super.onFieldChanged("description", `${ranking.name}`);
            }
        }
    }

    protected createNotification(
        state: FormState
    ): Either<ValidationError<RankingNotification>[], RankingNotification> {
        return RankingNotification.create(statetoData(state));
    }
}

export default SendRankingNotificationBloc;

const initialFieldsState = (rankings: RankingData[]): FormSectionState[] => {
    const rankingOptions = rankings.map(ranking => ({
        id: ranking.id,
        name: `${ranking.name}`,
    }));

    return [
        {
            fields: [
                {
                    kind: "FormSingleFieldState",
                    label: "Topic",
                    name: "topic",
                    value: DEBUG_RANKING_NEWS_TOPIC,
                    selectOptions: [
                        { id: DEBUG_RANKING_NEWS_TOPIC, name: "Debug" },
                        { id: RANKING_NEWS_TOPIC, name: "Real" },
                    ],
                    md: 6,
                    xs: 12,
                    required: true,
                },
                {
                    kind: "FormSingleFieldState",
                    label: "Ranking",
                    name: "rankingId",
                    value: rankingOptions[0]?.id,
                    selectOptions: rankingOptions,
                    md: 6,
                    xs: 12,
                    required: true,
                },
                {
                    kind: "FormSingleFieldState",
                    label: "Title",
                    name: "title",
                    required: true,
                    value: "Karate Stars - ranking update",
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
