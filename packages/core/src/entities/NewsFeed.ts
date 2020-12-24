import { Either } from "../types/Either";
import { ValidationErrorsDictionary } from "../types/Errors";
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
    public readonly image: Url;
    public readonly url: Url;

    private constructor(data: NewsFeedData) {
        super(data.id);

        this.url = data.url;
        this.name = data.name;
        this.language = data.language;
        this.type = data.type;
        this.image = data.image;
    }

    public static create(data: NewsFeedRawData): Either<ValidationErrorsDictionary, NewsFeed> {
        const finalId = !data.id ? Id.generateId().value : data.id;
        const errors = validate({ ...data, id: finalId });

        if (Object.keys(errors).length === 0) {
            return Either.right(
                new NewsFeed({
                    id: Id.createExisted(finalId).get(),
                    name: data.name,
                    language: data.language,
                    type: data.type,
                    url: Url.create(data.url).get(),
                    image: data.image ? Url.create(data.image).get() : undefined,
                })
            );
        } else {
            return Either.left(errors);
        }
    }

    public update(data: Omit<NewsFeedRawData, "id">): Either<ValidationErrorsDictionary, NewsFeed> {
        const errors = validate({ ...data, id: this.id.value });

        if (Object.keys(errors).length === 0) {
            return Either.right(
                new NewsFeed({
                    id: this.id,
                    name: data.name,
                    language: data.language,
                    type: data.type,
                    url: Url.create(data.url).get(),
                    image: data.image ? Url.create(data.image).get() : undefined,
                })
            );
        } else {
            return Either.left(errors);
        }
    }

    public toRawData(): NewsFeedRawData {
        return {
            id: this.id.value,
            name: this.name,
            language: this.language,
            type: this.type,
            image: this.image.value,
            url: this.url.value,
        };
    }
}

function validate(data: NewsFeedRawData): ValidationErrorsDictionary {
    const errors: ValidationErrorsDictionary = {
        id: Id.createExisted(data.id).fold(
            errors => errors,
            () => []
        ),
        name: validateRequired(data.name),
        language: validateRequired(data.language),
        type: validateRequired(data.type),
        url: Url.create(data.url).fold(
            errors => errors,
            () => []
        ),
        image: data.image
            ? Url.create(data.image).fold(
                  errors => errors,
                  () => []
              )
            : [],
    };

    Object.keys(errors).forEach((key: string) => errors[key].length === 0 && delete errors[key]);

    return errors;
}
