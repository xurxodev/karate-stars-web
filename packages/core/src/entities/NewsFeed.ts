import { Either } from "../types/Either";
import { ValidationErrorsDictionary } from "../types/Errors";
import { validateRequired } from "../utils/validations";
import { Id } from "../value-objects/Id";
import { Url } from "../value-objects/Url";
import { ImageUrl } from "../value-objects/ImageUrl";
import { Entity, EntityData } from "./Entity";

export type RssType = "rss" | "atom";

export interface NewsFeedData extends EntityData {
    name: string;
    language: string;
    type: RssType;
    image: Url;
    url: Url;
}

export interface NewsFeedRawData {
    id: string
    name: string;
    language: string;
    type: RssType;
    image: string;
    url: string;
}

export class NewsFeed extends Entity<NewsFeed> implements NewsFeedData {
    public readonly id: Id;
    public readonly name: string;
    public readonly language: string;
    public readonly type: RssType;
    public readonly image: ImageUrl;
    public readonly url: Url;

    private constructor(data: NewsFeedData) {
        super(data.id);

        this.url = data.url;
        this.name = data.name;
        this.language = data.language;
        this.type = data.type;
        this.image = data.image;
    }

    public static create({ id, name, language, type, image, url }: NewsFeedRawData):
        Either<ValidationErrorsDictionary, NewsFeed> {
        const urlValue = Url.create(url);
        const imageValue = Url.create(image);

        const IdValue = id !== "" ? Id.createExisted(id) : null;

        const errors: ValidationErrorsDictionary = {
            id: IdValue ? IdValue.fold(errors => errors, () => []) : [],
            name: validateRequired(name),
            language: validateRequired(language),
            type: validateRequired(type),
            url: urlValue.fold(errors => errors, () => []),
            image: imageValue.fold(errors => errors, () => [])
        };

        Object.keys(errors).forEach(
            (key: string) => errors[key].length === 0 && delete errors[key]
        );

        if (Object.keys(errors).length === 0) {
            const finalId = IdValue ? IdValue.get() : Id.generateId();

            return Either.right(
                new NewsFeed({ id: finalId, name, language, type, url: urlValue.get(), image: imageValue.get() })
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
            url: this.url.value
        }
    }
}
