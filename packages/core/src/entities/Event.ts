import { Either } from "../types/Either";
import { ValidationError } from "../types/Errors";
import { validateRequired } from "../utils/validations";
import { Id } from "../value-objects/Id";
import { Url } from "../value-objects/Url";
import { Entity, EntityObjectData, EntityData } from "./Entity";

interface EventObjectData extends EntityObjectData {
    name: string;
    typeId: Id;
    startDate: Date;
    endDate: Date;
    url?: Url;
}

export interface EventData extends EntityData {
    name: string;
    typeId: string;
    startDate: Date;
    endDate: Date;
    url?: string;
}

export class Event extends Entity<EventData> implements EventObjectData {
    public readonly name: string;
    public readonly typeId: Id;
    public readonly startDate: Date;
    public readonly endDate: Date;
    public readonly url: Url;

    private constructor(data: EventObjectData) {
        super(data.id);

        this.name = data.name;
        this.typeId = data.typeId;
        this.startDate = data.startDate;
        this.endDate = data.endDate;
        this.url = data.url;
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
            typeId: this.typeId.value,
            startDate: this.startDate,
            endDate: this.endDate,
            url: this.url?.value,
        };
    }

    private static validateAndCreate(data: EventData): Either<ValidationError<EventData>[], Event> {
        const idResult = Id.createExisted(data.id);
        const typeIdResult = Id.createExisted(data.typeId);
        const urlResult = data.url ? Url.create(data.url) : undefined;

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
            {
                property: "typeId" as const,
                errors: typeIdResult.fold(
                    errors => errors,
                    () => []
                ),
                value: data.typeId,
            },
            {
                property: "startDate" as const,
                errors: validateRequired(data.startDate),
                value: data.startDate,
            },
            {
                property: "endDate" as const,
                errors: validateRequired(data.endDate),
                value: data.endDate,
            },
            {
                property: "url" as const,
                errors: urlResult
                    ? urlResult.fold(
                          errors => errors,
                          () => []
                      )
                    : [],
                value: data.url,
            },
        ]
            .map(error => ({ ...error, type: Event.name }))
            .filter(validation => validation.errors.length > 0);

        if (errors.length === 0) {
            return Either.right(
                new Event({
                    id: idResult.get(),
                    name: data.name,
                    typeId: typeIdResult.get(),
                    startDate: data.startDate,
                    endDate: data.endDate,
                    url: data.url ? urlResult.get() : undefined,
                })
            );
        } else {
            return Either.left(errors);
        }
    }
}
