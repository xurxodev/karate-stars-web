import { Either } from "../types/Either";
import { ValidationError } from "../types/Errors";
import { validateRequired } from "../utils/validations";
import { Id } from "../value-objects/Id";
import { Url } from "../value-objects/Url";
import { Entity, EntityData, EntityRawData } from "./Entity";

export type RssType = "rss" | "atom";

export interface NewsFeedData extends EntityData {
    name: string;
    language: string;
    type: RssType;
    image?: Url;
    url: Url;
}

export interface NewsFeedRawData extends EntityRawData {
    name: string;
    language: string;
    type: RssType;
    image?: string;
    url: string;
}

export class NewsFeed extends Entity<NewsFeedData, NewsFeedRawData> implements NewsFeedData {
    public readonly name: string;
    public readonly language: string;
    public readonly type: RssType;
    public readonly image?: Url;
    public readonly url: Url;

    private constructor(data: NewsFeedData) {
        super(data.id);

        this.url = data.url;
        this.name = data.name;
        this.language = data.language;
        this.type = data.type;
        this.image = data.image;
    }

    public static create(data: NewsFeedRawData): Either<ValidationError<NewsFeed>[], NewsFeed> {
        const finalId = !data.id ? Id.generateId().value : data.id;

        return this.validateAndCreate({ ...data, id: finalId });
    }

    public update(
        dataToUpdate: Partial<Omit<NewsFeedRawData, "id">>
    ): Either<ValidationError<NewsFeed>[], NewsFeed> {
        const newData = { ...this.toRawData(), ...dataToUpdate };

        return NewsFeed.validateAndCreate(newData);
    }

    public toRawData(): NewsFeedRawData {
        return {
            id: this.id.value,
            name: this.name,
            language: this.language,
            type: this.type,
            image: this.image?.value,
            url: this.url.value,
        };
    }

    private static validateAndCreate(
        data: NewsFeedRawData
    ): Either<ValidationError<NewsFeed>[], NewsFeed> {
        const idResult = Id.createExisted(data.id);
        const urlResult = Url.create(data.url, false);
        const imageResult = data.image ? Url.create(data.image, true) : undefined;

        const errors: ValidationError<NewsFeed>[] = [
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
                property: "language" as const,
                errors: validateRequired(data.language),
                value: data.language,
            },
            { property: "type" as const, errors: validateRequired(data.type), value: data.type },
            {
                property: "url" as const,
                errors: urlResult.fold(
                    errors => errors,
                    () => []
                ),
                value: data.url,
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
        ]
            .map(error => ({ ...error, type: NewsFeed.name }))
            .filter(validation => validation.errors.length > 0);

        if (errors.length === 0) {
            return Either.right(
                new NewsFeed({
                    id: idResult.get(),
                    name: data.name,
                    language: data.language,
                    type: data.type,
                    url: urlResult.get(),
                    image: data.image ? imageResult.get() : undefined,
                })
            );
        } else {
            return Either.left(errors);
        }
    }
}
