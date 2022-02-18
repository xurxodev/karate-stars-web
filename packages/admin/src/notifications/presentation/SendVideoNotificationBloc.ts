import {
    FormState,
    FormSectionState,
    statetoData,
} from "../../common/presentation/state/FormState";
import { VIDEO_NEWS_TOPIC, DEBUG_VIDEO_NEWS_TOPIC } from "../domain/entities/Notification";
import { VideoNotification } from "../domain/entities/VideoNotification";
import SendPushNotificationUseCase from "../domain/SendPushNotificationUseCase";
import { Either, ValidationError, VideoData } from "karate-stars-core";
import SendNotificationBloc from "./SendNotificationBloc";
import GetVideosUseCase from "../../videos/domain/GetVideosUseCase";

class SendVideoNotificationBloc extends SendNotificationBloc<VideoNotification> {
    videos: VideoData[] = [];

    constructor(
        sendPushNotificationUseCase: SendPushNotificationUseCase,
        private getVideosUseCase: GetVideosUseCase
    ) {
        super(sendPushNotificationUseCase, {
            isValid: false,
            sections: initialFieldsState([]),
        });
        this.init();
    }

    private async init() {
        this.videos = (await this.getVideosUseCase.execute()).fold(
            () => [],
            videos => videos
        );

        this.changeState({ ...this.state, sections: initialFieldsState(this.videos) });
    }

    onFieldChanged(name: string, value: string | string[] | boolean) {
        super.onFieldChanged(name, value);

        if (name === "videoId") {
            const video = this.videos.find(video => video.id === value);

            if (video) {
                super.onFieldChanged(
                    "description",
                    `${video.title}\n${video.subtitle}\n${video.description}`
                );
            }
        }
    }

    protected createNotification(
        state: FormState
    ): Either<ValidationError<VideoNotification>[], VideoNotification> {
        return VideoNotification.create(statetoData(state));
    }
}

export default SendVideoNotificationBloc;

const initialFieldsState = (videos: VideoData[]): FormSectionState[] => {
    const videoOptions = videos.map(video => ({
        id: video.id,
        name: `${video.title} - ${video.subtitle} -  ${video.description}`,
    }));

    return [
        {
            fields: [
                {
                    kind: "FormSingleFieldState",
                    label: "Topic",
                    name: "topic",
                    value: DEBUG_VIDEO_NEWS_TOPIC,
                    selectOptions: [
                        { id: DEBUG_VIDEO_NEWS_TOPIC, name: "Debug" },
                        { id: VIDEO_NEWS_TOPIC, name: "Real" },
                    ],
                    md: 6,
                    xs: 12,
                    required: true,
                },
                {
                    kind: "FormSingleFieldState",
                    label: "Video",
                    name: "videoId",
                    value: videoOptions[0]?.id,
                    selectOptions: videoOptions,
                    md: 6,
                    xs: 12,
                    required: true,
                },
                {
                    kind: "FormSingleFieldState",
                    label: "Title",
                    name: "title",
                    required: true,
                    value: "Karate Stars - new video",
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
