import { Either } from "../types/Either";
import { ValidationError } from "../types/Errors";
import { validateRequired } from "../utils/validations";
import { Id } from "../value-objects/Id";
import { Entity, EntityData, EntityRawData } from "./Entity";

export interface CategoryData extends EntityData {
    name: string;
    typeId: Id;
}

export interface CategoryRawData extends EntityRawData {
    name: string;
    typeId: string;
}

export class Category extends Entity<CategoryData, CategoryRawData> implements CategoryData {
    public readonly name: string;
    public readonly typeId: Id;

    private constructor(data: CategoryData) {
        super(data.id);

        this.name = data.name;
        this.typeId = data.typeId;
    }

    public static create(data: CategoryRawData): Either<ValidationError<Category>[], Category> {
        const finalId = !data.id ? Id.generateId().value : data.id;

        return this.validateAndCreate({ ...data, id: finalId });
    }

    public update(
        dataToUpdate: Partial<Omit<CategoryRawData, "id">>
    ): Either<ValidationError<Category>[], Category> {
        const newData = { ...this.toRawData(), ...dataToUpdate };

        return Category.validateAndCreate(newData);
    }

    public toRawData(): CategoryRawData {
        return {
            id: this.id.value,
            name: this.name,
            typeId: this.typeId.value,
        };
    }

    private static validateAndCreate(
        data: CategoryRawData
    ): Either<ValidationError<Category>[], Category> {
        const idResult = Id.createExisted(data.id);
        const typeIdResult = Id.createExisted(data.typeId);

        const errors: ValidationError<Category>[] = [
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
        ]
            .map(error => ({ ...error, type: Category.name }))
            .filter(validation => validation.errors.length > 0);

        if (errors.length === 0) {
            return Either.right(
                new Category({ id: idResult.get(), name: data.name, typeId: typeIdResult.get() })
            );
        } else {
            return Either.left(errors);
        }
    }
}
