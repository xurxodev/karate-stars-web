import { Either } from "../types/Either";
import { ValidationError } from "../types/Errors";
import { validateRequired } from "../utils/validations";
import { Id } from "../value-objects/Id";
import { Entity, EntityObjectData, EntityData } from "./Entity";

interface EventTypeObjectData extends EntityObjectData {
    name: string;
}

export interface EventTypeData extends EntityData {
    name: string;
}

export class EventType extends Entity<EventTypeData> implements EventTypeObjectData {
    public readonly name: string;

    private constructor(data: EventTypeObjectData) {
        super(data.id);

        this.name = data.name;
    }

    public static create(data: EventTypeData): Either<ValidationError<EventTypeData>[], EventType> {
        const finalId = !data.id ? Id.generateId().value : data.id;

        return this.validateAndCreate({ ...data, id: finalId });
    }

    public update(
        dataToUpdate: Partial<Omit<EventTypeData, "id">>
    ): Either<ValidationError<EventTypeData>[], EventType> {
        const newData = { ...this.toData(), ...dataToUpdate };

        return EventType.validateAndCreate(newData);
    }

    public toData(): EventTypeData {
        return {
            id: this.id.value,
            name: this.name,
        };
    }

    private static validateAndCreate(
        data: EventTypeData
    ): Either<ValidationError<EventTypeData>[], EventType> {
        const idResult = Id.createExisted(data.id);

        const errors: ValidationError<EventTypeData>[] = [
            {
                property: "id" as const,
                errors: idResult.fold(
                    errors => errors,
                    () => []
                ),
                value: data.id,
            },
            { property: "name" as const, errors: validateRequired(data.name), value: data.name },
        ]
            .map(error => ({ ...error, type: EventType.name }))
            .filter(validation => validation.errors.length > 0);

        if (errors.length === 0) {
            return Either.right(new EventType({ id: idResult.get(), name: data.name }));
        } else {
            return Either.left(errors);
        }
    }
}
