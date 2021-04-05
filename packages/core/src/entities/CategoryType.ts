import { Either } from "../types/Either";
import { ValidationError } from "../types/Errors";
import { validateRequired } from "../utils/validations";
import { Id } from "../value-objects/Id";
import { Entity, EntityObjectData, EntityData } from "./Entity";

interface CategoryTypeObjectData extends EntityObjectData {
    name: string;
}

export interface CategoryTypeData extends EntityData {
    name: string;
}

export class CategoryType extends Entity<CategoryTypeData> implements CategoryTypeObjectData {
    public readonly name: string;

    private constructor(data: CategoryTypeObjectData) {
        super(data.id);

        this.name = data.name;
    }

    public static create(
        data: CategoryTypeData
    ): Either<ValidationError<CategoryTypeData>[], CategoryType> {
        const finalId = !data.id ? Id.generateId().value : data.id;

        return this.validateAndCreate({ ...data, id: finalId });
    }

    public update(
        dataToUpdate: Partial<Omit<CategoryTypeData, "id">>
    ): Either<ValidationError<CategoryTypeData>[], CategoryType> {
        const newData = { ...this.toData(), ...dataToUpdate };

        return CategoryType.validateAndCreate(newData);
    }

    public toData(): CategoryTypeData {
        return {
            id: this.id.value,
            name: this.name,
        };
    }

    private static validateAndCreate(
        data: CategoryTypeData
    ): Either<ValidationError<CategoryTypeData>[], CategoryType> {
        const idResult = Id.createExisted(data.id);

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
