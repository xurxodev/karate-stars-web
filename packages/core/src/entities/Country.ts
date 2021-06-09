import { Either } from "../types/Either";
import { ValidationError } from "../types/Errors";
import { validateRequired } from "../utils/validations";
import { Id } from "../value-objects/Id";
import { Url } from "../value-objects/Url";
import { Entity, EntityObjectData, EntityData } from "./Entity";

interface CountryObjectData extends EntityObjectData {
    name: string;
    iso2: string;
    image?: Url;
}

export interface CountryData extends EntityData {
    name: string;
    iso2: string;
    image?: string;
}

export class Country extends Entity<CountryData> {
    public readonly name: string;
    public readonly iso2: string;
    public readonly image: Url;

    private constructor(data: CountryObjectData) {
        super(data.id);

        this.name = data.name;
        this.iso2 = data.iso2;
        this.image = data.image;
    }

    public static create(data: CountryData): Either<ValidationError<CountryData>[], Country> {
        const finalId = !data.id ? Id.generateId().value : data.id;

        return this.validateAndCreate({ ...data, id: finalId });
    }

    public update(
        dataToUpdate: Partial<Omit<CountryData, "id">>
    ): Either<ValidationError<CountryData>[], Country> {
        const newData = { ...this.toData(), ...dataToUpdate };

        return Country.validateAndCreate(newData);
    }

    public toData(): CountryData {
        return {
            id: this.id.value,
            name: this.name,
            iso2: this.iso2,
            image: this.image?.value,
        };
    }

    private static validateAndCreate(
        data: CountryData
    ): Either<ValidationError<CountryData>[], Country> {
        const idResult = Id.createExisted(data.id);
        const imageResult = data.image ? Url.create(data.image, true) : undefined;

        const errors: ValidationError<CountryData>[] = [
            {
                property: "id" as const,
                errors: idResult.fold(
                    errors => errors,
                    () => []
                ),
                value: data.id,
            },
            {
                property: "image" as const,
                errors: imageResult
                    ? imageResult.fold(
                          errors => errors,
                          () => []
                      )
                    : [],
                value: data.image,
            },
            { property: "name" as const, errors: validateRequired(data.name), value: data.name },
            { property: "iso2" as const, errors: validateRequired(data.iso2), value: data.iso2 },
        ]
            .map(error => ({ ...error, type: Country.name }))
            .filter(validation => validation.errors.length > 0);

        if (errors.length === 0) {
            return Either.right(
                new Country({
                    id: idResult.get(),
                    name: data.name,
                    iso2: data.iso2,
                    image: imageResult ? imageResult.get() : undefined,
                })
            );
        } else {
            return Either.left(errors);
        }
    }
}
