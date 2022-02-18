import { Notification, NotificationData, NotificationObjectData } from "./Notification";
import { Either, ValidationError, Id } from "karate-stars-core";

export interface CompetitorNotificationObjectData extends NotificationObjectData {
    competitorId: Id;
}

export interface CompetitorNotificationData extends NotificationData {
    competitorId: string;
}

export class CompetitorNotification extends Notification {
    public readonly competitorId: Id;

    private constructor({
        topic,
        title,
        description,
        competitorId,
    }: CompetitorNotificationObjectData) {
        super({ title, description, topic });
        this.competitorId = competitorId;
    }

    public static create({
        topic,
        title,
        description,
        competitorId,
    }: CompetitorNotificationData): Either<
        ValidationError<CompetitorNotification>[],
        CompetitorNotification
    > {
        const competitorIdValue = Id.createExisted(competitorId);

        const errors: ValidationError<CompetitorNotification>[] = [
            ...super.validateBase({ topic, title, description }),
            {
                property: "competitorId" as const,
                errors: competitorIdValue.fold(
                    errors => errors,
                    () => []
                ),
                value: competitorId,
            },
        ]
            .map(error => ({ ...error, type: CompetitorNotification.name }))
            .filter(validation => validation.errors.length > 0);

        if (errors.length === 0) {
            return Either.right(
                new CompetitorNotification({
                    title,
                    description,
                    topic,
                    competitorId: competitorIdValue.getOrThrow(),
                })
            );
        } else {
            return Either.left(errors);
        }
    }
}
