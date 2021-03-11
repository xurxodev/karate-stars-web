import { Either } from "../types/Either";
import { ValidationError } from "../types/Errors";
import { validateRequired } from "../utils/validations";
import { Id } from "../value-objects/Id";
import { Entity, EntityData, EntityRawData } from "./Entity";

export interface CountryData extends EntityData {
    name: string;
    iso2: string;
}

export interface CountryRawData extends EntityRawData {
    name: string;
    iso2: string;
}

export class Country extends Entity<CountryData, CountryRawData> implements CountryData {
    public readonly name: string;
    public readonly iso2: string;

    private constructor(data: CountryData) {
        super(data.id);

        this.name = data.name;
        this.iso2 = data.iso2;
    }

    public static create(data: CountryRawData): Either<ValidationError<Country>[], Country> {
        const finalId = !data.id ? Id.generateId().value : data.id;

        return this.validateAndCreate({ ...data, id: finalId });
    }

    public update(
        dataToUpdate: Partial<Omit<CountryRawData, "id">>
    ): Either<ValidationError<Country>[], Country> {
        const newData = { ...this.toRawData(), ...dataToUpdate };

        return Country.validateAndCreate(newData);
    }

    public toRawData(): CountryRawData {
        return {
            id: this.id.value,
            name: this.name,
            iso2: this.iso2,
        };
    }

    private static validateAndCreate(
        data: CountryRawData
    ): Either<ValidationError<Country>[], Country> {
        const idResult = Id.createExisted(data.id);

        const errors: ValidationError<Country>[] = [
            {
                property: "id" as const,
                errors: idResult.fold(
                    errors => errors,
                    () => []
                ),
                value: data.id,
            },
            { property: "name" as const, errors: validateRequired(data.name), value: data.name },
            { property: "iso2" as const, errors: validateRequired(data.iso2), value: data.iso2 },
        ]
            .map(error => ({ ...error, type: Country.name }))
            .filter(validation => validation.errors.length > 0);

        if (errors.length === 0) {
            return Either.right(
                new Country({ id: idResult.get(), name: data.name, iso2: data.iso2 })
            );
        } else {
            return Either.left(errors);
        }
    }
}
