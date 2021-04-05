import { Either } from "../types/Either";
import { ValidationError } from "../types/Errors";
import { validateRequired } from "../utils/validations";
import { Id } from "../value-objects/Id";
import { Entity, EntityObjectData, EntityData } from "./Entity";

interface EventObjectData extends EntityObjectData {
    name: string;
    year: number;
    typeId: Id;
}

export interface EventData extends EntityData {
    name: string;
    year: number;
    typeId: string;
}

export class Event extends Entity<EventData> implements EventObjectData {
    public readonly name: string;
    public readonly year: number;
    public readonly typeId: Id;

    private constructor(data: EventObjectData) {
        super(data.id);

        this.name = data.name;
        this.year = data.year;
        this.typeId = data.typeId;
    }

    public static create(data: EventData): Either<ValidationError<EventData>[], Event> {
        const finalId = !data.id ? Id.generateId().value : data.id;

        return this.validateAndCreate({ ...data, id: finalId });
    }

    public update(
        dataToUpdate: Partial<Omit<EventData, "id">>
    ): Either<ValidationError<EventData>[], Event> {
        const newData = { ...this.toData(), ...dataToUpdate };

        return Event.validateAndCreate(newData);
    }

    public toData(): EventData {
        return {
            id: this.id.value,
            name: this.name,
            year: this.year,
            typeId: this.typeId.value,
        };
    }

    private static validateAndCreate(data: EventData): Either<ValidationError<EventData>[], Event> {
        const idResult = Id.createExisted(data.id);
        const typeIdResult = Id.createExisted(data.typeId);

        const errors = [
            {
                property: "id" as const,
                errors: idResult.fold(
                    errors => errors,
                    () => []
                ),
                value: data.id,
            },
            { property: "name" as const, errors: validateRequired(data.name), value: data.name },
            { property: "year" as const, errors: validateRequired(data.year), value: data.year },
            {
                property: "typeId" as const,
                errors: typeIdResult.fold(
                    errors => errors,
                    () => []
                ),
                value: data.typeId,
            },
        ]
            .map(error => ({ ...error, type: Event.name }))
            .filter(validation => validation.errors.length > 0);

        if (errors.length === 0) {
            return Either.right(
                new Event({
                    id: idResult.get(),
                    name: data.name,
                    year: data.year,
                    typeId: typeIdResult.get(),
                })
            );
        } else {
            return Either.left(errors);
        }
    }
}
