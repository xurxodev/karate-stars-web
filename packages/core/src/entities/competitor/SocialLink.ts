import { Either } from "../../types/Either";
import { ValidationError } from "../../types/Errors";
import { validateRequired } from "../../utils/validations";
import { Url } from "../../value-objects/Url";
import { ValueObject } from "../../value-objects/ValueObject";

export type SocialLinkType = "web" | "twitter" | "facebook" | "instagram";

export interface SocialLinkRawData {
    url: string;
    type: SocialLinkType;
}

export interface SocialLinkData {
    url: Url;
    type: SocialLinkType;
}

export class SocialLink extends ValueObject<SocialLinkData> implements SocialLinkData {
    public readonly url: Url;
    public readonly type: SocialLinkType;

    private constructor(data: SocialLinkData) {
        super(data);

        this.url = data.url;
        this.type = data.type;
    }

    public static create(
        data: SocialLinkRawData
    ): Either<ValidationError<SocialLink>[], SocialLink> {
        const urlResult = Url.create(data.url);

        const errors: ValidationError<SocialLink>[] = [
            {
                property: "url" as const,
                errors: urlResult.fold(
                    errors => errors,
                    () => []
                ),
                value: data.url,
            },
            { property: "type" as const, errors: validateRequired(data.type), value: data.type },
        ]
            .map(error => ({ ...error, type: SocialLink.name }))
            .filter(validation => validation.errors.length > 0);

        if (errors.length === 0) {
            return Either.right(new SocialLink({ url: urlResult.get(), type: data.type }));
        } else {
            return Either.left(errors);
        }
    }
}
