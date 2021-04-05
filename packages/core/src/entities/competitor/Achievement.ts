import { Either } from "../../types/Either";
import { ValidationError } from "../../types/Errors";
import { validateRequiredNumber } from "../../utils/validations";
import { Id } from "../../value-objects/Id";
import { ValueObject } from "../../value-objects/ValueObject";

export interface AchievementData {
    eventId: string;
    categoryId: string;
    position: number;
}

interface AchievementEntityData {
    eventId: Id;
    categoryId: Id;
    position: number;
}

export class Achievement extends ValueObject<AchievementEntityData> {
    public readonly eventId: Id;
    public readonly categoryId: Id;
    public readonly position: number;

    private constructor(data: AchievementEntityData) {
        super(data);

        this.eventId = data.eventId;
        this.categoryId = data.categoryId;
        this.position = data.position;
    }

    public static create(
        data: AchievementData
    ): Either<ValidationError<Achievement>[], Achievement> {
        const categoryIdResult = Id.createExisted(data.categoryId);
        const eventIdResult = Id.createExisted(data.eventId);

        const errors: ValidationError<Achievement>[] = [
            {
                property: "categoryId" as const,
                errors: categoryIdResult.fold(
                    errors => errors,
                    () => []
                ),
                value: data.categoryId,
            },
            {
                property: "eventId" as const,
                errors: eventIdResult.fold(
                    errors => errors,
                    () => []
                ),
                value: data.eventId,
            },
            {
                property: "position" as const,
                errors: validateRequiredNumber(data.position),
                value: data.position,
            },
        ]
            .map(error => ({ ...error, type: Achievement.name }))
            .filter(validation => validation.errors.length > 0);

        if (errors.length === 0) {
            return Either.right(
                new Achievement({
                    eventId: eventIdResult.get(),
                    categoryId: categoryIdResult.get(),
                    position: data.position,
                })
            );
        } else {
            return Either.left(errors);
        }
    }
}
