import { Either } from "../types/Either";
import { ValidationError } from "../types/Errors";
import { validateRequired } from "../utils/validations";
import { Id } from "../value-objects/Id";
import { Entity, EntityObjectData, EntityData } from "./Entity";

interface CategoryObjectData extends EntityObjectData {
    name: string;
    typeId: Id;
    wkfId: string | null;
    paraKarate: boolean;
    main: boolean;
}

export interface CategoryData extends EntityData {
    name: string;
    typeId: string;
    wkfId: string | null;
    paraKarate: boolean;
    main: boolean;
}

export class Category extends Entity<CategoryData> {
    public readonly name: string;
    public readonly typeId: Id;
    public readonly wkfId: string | null;
    public readonly paraKarate: boolean;
    public readonly main: boolean;

    private constructor(data: CategoryObjectData) {
        super(data.id);

        this.name = data.name;
        this.typeId = data.typeId;
        this.wkfId = data.wkfId;
        this.paraKarate = data.paraKarate;
        this.main = data.main;
    }

    public static create(data: CategoryData): Either<ValidationError<CategoryData>[], Category> {
        const finalId = !data.id ? Id.generateId().value : data.id;

        return this.validateAndCreate({ ...data, id: finalId });
    }

    public update(
        dataToUpdate: Partial<Omit<CategoryData, "id">>
    ): Either<ValidationError<CategoryData>[], Category> {
        const newData = { ...this.toData(), ...dataToUpdate };

        return Category.validateAndCreate(newData);
    }

    public toData(): CategoryData {
        return {
            id: this.id.value,
            name: this.name,
            typeId: this.typeId.value,
            wkfId: this.wkfId,
            paraKarate: this.paraKarate,
            main: this.main,
        };
    }

    private static validateAndCreate(
        data: CategoryData
    ): Either<ValidationError<CategoryData>[], Category> {
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
                new Category({
                    id: idResult.get(),
                    name: data.name,
                    typeId: typeIdResult.get(),
                    wkfId: data.wkfId === "" || !data.wkfId ? null : data.wkfId,
                    paraKarate: data.paraKarate,
                    main: data.main,
                })
            );
        } else {
            return Either.left(errors);
        }
    }
}
