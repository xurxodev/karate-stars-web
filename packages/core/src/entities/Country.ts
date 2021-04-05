import { Either } from "../types/Either";
import { ValidationError } from "../types/Errors";
import { validateRequired } from "../utils/validations";
import { Id } from "../value-objects/Id";
import { Entity, EntityObjectData, EntityData } from "./Entity";

interface CountryObjectData extends EntityObjectData {
    name: string;
    iso2: string;
}

export interface CountryData extends EntityData {
    name: string;
    iso2: string;
}

export class Country extends Entity<CountryData> {
    public readonly name: string;
    public readonly iso2: string;

    private constructor(data: CountryObjectData) {
        super(data.id);

        this.name = data.name;
        this.iso2 = data.iso2;
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
        };
    }

    private static validateAndCreate(
        data: CountryData
    ): Either<ValidationError<CountryData>[], Country> {
        const idResult = Id.createExisted(data.id);

        const errors: ValidationError<CountryData>[] = [
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
