import { Either } from "../../types/Either";
import { ValidationError } from "../../types/Errors";
import { validateRequired } from "../../utils/validations";
import { ValueObject } from "../../value-objects/ValueObject";

export type VideoLinkType = "youtube" | "facebook" | "vimeo";

export interface VideoLinkData {
    id: string;
    type: VideoLinkType;
}

interface VideoLinkTypeObjectData {
    id: string;
    type: VideoLinkType;
}

export class VideoLink extends ValueObject<VideoLinkTypeObjectData> {
    public readonly id: string;
    public readonly type: VideoLinkType;

    private constructor(data: VideoLinkTypeObjectData) {
        super(data);

        this.id = data.id;
        this.type = data.type;
    }

    public static create(data: VideoLinkData): Either<ValidationError<VideoLinkData>[], VideoLink> {
        const errors = [
            { property: "id" as const, errors: validateRequired(data.id), value: data.id },
            { property: "type" as const, errors: validateRequired(data.type), value: data.type },
        ]
            .map(error => ({ ...error, type: VideoLink.name }))
            .filter(validation => validation.errors.length > 0);

        if (errors.length === 0) {
            return Either.right(new VideoLink({ id: data.id, type: data.type }));
        } else {
            return Either.left(errors);
        }
    }
}
