import { Either } from "../types/Either";
import { ValidationError } from "../types/Errors";
import { validateRequired } from "../utils/validations";
import { Id } from "../value-objects/Id";
import { Entity, EntityData, EntityRawData } from "./Entity";

export interface CategoryTypeData extends EntityData {
    name: string;
}

export interface CategoryTypeRawData extends EntityRawData {
    name: string;
}

export class CategoryType extends Entity<CategoryTypeRawData> implements CategoryTypeData {
    public readonly name: string;

    private constructor(data: CategoryTypeData) {
        super(data.id);

        this.name = data.name;
    }

    public static create(
        data: CategoryTypeRawData
    ): Either<ValidationError<CategoryType>[], CategoryType> {
        const finalId = !data.id ? Id.generateId().value : data.id;

        return this.validateAndCreate({ ...data, id: finalId });
    }

    public update(
        dataToUpdate: Partial<Omit<CategoryTypeRawData, "id">>
    ): Either<ValidationError<CategoryType>[], CategoryType> {
        const newData = { ...this.toRawData(), ...dataToUpdate };

        return CategoryType.validateAndCreate(newData);
    }

    public toRawData(): CategoryTypeRawData {
        return {
            id: this.id.value,
            name: this.name,
        };
    }

    private static validateAndCreate(
        data: CategoryTypeRawData
    ): Either<ValidationError<CategoryType>[], CategoryType> {
        const idResult = Id.createExisted(data.id);

        const errors: ValidationError<CategoryType>[] = [
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
            .map(error => ({ ...error, type: CategoryType.name }))
            .filter(validation => validation.errors.length > 0);

        if (errors.length === 0) {
            return Either.right(new CategoryType({ id: idResult.get(), name: data.name }));
        } else {
            return Either.left(errors);
        }
    }
}
