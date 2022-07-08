import { Notification, NotificationData, NotificationObjectData } from "./Notification";
import { Either, ValidationError, Id } from "karate-stars-core";

export interface RankingNotificationObjectData extends NotificationObjectData {
    rankingId: Id;
}

export interface RankingNotificationData extends NotificationData {
    rankingId: string;
}

export class RankingNotification extends Notification {
    public readonly rankingId: Id;

    private constructor({ topic, title, description, rankingId }: RankingNotificationObjectData) {
        super({ title, description, topic });
        this.rankingId = rankingId;
    }

    public static create({
        topic,
        title,
        description,
        rankingId,
    }: RankingNotificationData): Either<
        ValidationError<RankingNotification>[],
        RankingNotification
    > {
        const RankingIdValue = Id.createExisted(rankingId);

        const errors: ValidationError<RankingNotification>[] = [
            ...super.validateBase({ topic, title, description }),
            {
                property: "rankingId" as const,
                errors: RankingIdValue.fold(
                    errors => errors,
                    () => []
                ),
                value: rankingId,
            },
        ]
            .map(error => ({ ...error, type: RankingNotification.name }))
            .filter(validation => validation.errors.length > 0);

        if (errors.length === 0) {
            return Either.right(
                new RankingNotification({
                    title,
                    description,
                    topic,
                    rankingId: RankingIdValue.getOrThrow(),
                })
            );
        } else {
            return Either.left(errors);
        }
    }
}
