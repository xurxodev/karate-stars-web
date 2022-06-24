import { Either } from "../../types/Either";
import { ValidationError } from "../../types/Errors";
import { validateRequired } from "../../utils/validations";
import { Id } from "../../value-objects/Id";
import { Url } from "../../value-objects/Url";
import { Category } from "../Category";
import { Entity, EntityData, EntityObjectData } from "../Entity";

interface RankingObjectData extends EntityObjectData {
    name: string;
    webUrl: Url | null;
    apiUrl: Url | null;
    categoryParameter: string | null;
    categories: Id[];
}

export interface RankingData extends EntityData {
    name: string;
    webUrl: string | null;
    apiUrl: string | null;
    categoryParameter: string | null;
    categories: string[];
}

export class Ranking extends Entity<RankingData> implements RankingObjectData {
    public readonly name: string;
    public readonly webUrl: Url | null;
    public readonly apiUrl: Url | null;
    public readonly categoryParameter: string | null;
    public readonly categories: Id[];

    private constructor(data: RankingObjectData) {
        super(data.id);

        this.name = data.name;
        this.webUrl = data.webUrl;
        this.apiUrl = data.apiUrl;
        this.categoryParameter = data.categoryParameter;
        this.categories = data.categories;
    }

    public static create(data: RankingData): Either<ValidationError<RankingData>[], Ranking> {
        const finalId = !data.id ? Id.generateId().value : data.id;

        return this.validateAndCreate({ ...data, id: finalId });
    }

    public update(
        dataToUpdate: Partial<Omit<RankingData, "id">>
    ): Either<ValidationError<RankingData>[], Ranking> {
        const newData = { ...this.toData(), ...dataToUpdate };

        return Ranking.validateAndCreate(newData);
    }

    public toData(): RankingData {
        return {
            id: this.id.value,
            name: this.name,
            webUrl: this.webUrl ? this.webUrl.value : null,
            apiUrl: this.apiUrl ? this.apiUrl.value : null,
            categoryParameter: this.categoryParameter,
            categories: this.categories.map(cat => cat.value),
        };
    }

    private static validateAndCreate(
        data: RankingData
    ): Either<ValidationError<RankingData>[], Ranking> {
        const idResult = Id.createExisted(data.id);
        const webUrlResult = data.webUrl ? Url.create(data.webUrl) : undefined;
        const apiUrlResult = data.apiUrl ? Url.create(data.apiUrl) : undefined;

        const categoryResults =
            data.categories && data.categories.length > 0
                ? data.categories.map(id => Id.createExisted(id))
                : undefined;

        const categoryErrors = categoryResults
            ? categoryResults.map(categoryResult => {
                  return {
                      property: "categories" as const,
                      errors: categoryResult.fold(
                          errors => errors,
                          () => []
                      ),
                      value: data.categories,
                      type: Category.name,
                  };
              })
            : [];

        const rankingErrors = [
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
                property: "webUrl" as const,
                errors: webUrlResult
                    ? webUrlResult.fold(
                          errors => errors,
                          () => []
                      )
                    : [],
                value: data.webUrl,
            },
            {
                property: "apiUrl" as const,
                errors: apiUrlResult
                    ? apiUrlResult.fold(
                          errors => errors,
                          () => []
                      )
                    : [],
                value: data.webUrl,
            },
        ].map(error => ({ ...error, type: Ranking.name }));

        const errors = [...rankingErrors, ...categoryErrors].filter(
            validation => validation.errors.length > 0
        );

        if (errors.length === 0) {
            return Either.right(
                new Ranking({
                    id: idResult.get(),
                    name: data.name,
                    webUrl: webUrlResult ? webUrlResult.get() : null,
                    apiUrl: apiUrlResult ? apiUrlResult.get() : null,
                    categoryParameter: data.categoryParameter,
                    categories: categoryResults ? categoryResults.map(result => result.get()) : [],
                })
            );
        } else {
            return Either.left(errors);
        }
    }
}
