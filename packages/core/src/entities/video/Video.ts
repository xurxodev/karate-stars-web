import { Either } from "../../types/Either";
import { ValidationError } from "../../types/Errors";
import { validateRequired } from "../../utils/validations";
import { Id } from "../../value-objects/Id";
import { Entity, EntityObjectData, EntityData } from "../Entity";
import { VideoLink, VideoLinkData } from "./VideoLink";

interface VideoObjectData extends EntityObjectData {
    links: VideoLink[];
    title: string;
    description: string;
    subtitle: string;
    competitors: Id[];
    eventDate: Date;
    createdDate: Date;
    order: number;
}

export interface VideoData extends EntityData {
    links: VideoLinkData[];
    title: string;
    description: string;
    subtitle: string;
    competitors: string[];
    eventDate: Date;
    createdDate: Date;
    order: number;
}

export type VideoValidationTypes = VideoData & VideoLinkData;

export class Video extends Entity<VideoData> {
    public readonly links: VideoLink[];
    public readonly title: string;
    public readonly description: string;
    public readonly subtitle: string;
    public readonly competitors: Id[];
    public readonly eventDate: Date;
    public readonly createdDate: Date;
    public readonly order: number;

    private constructor(data: VideoObjectData) {
        super(data.id);

        this.links = data.links;
        this.title = data.title;
        this.description = data.description;
        this.subtitle = data.subtitle;
        this.competitors = data.competitors;
        this.eventDate = data.eventDate;
        this.createdDate = data.createdDate;
        this.order = data.order;
    }

    public static create(data: VideoData): Either<ValidationError<VideoValidationTypes>[], Video> {
        const finalId = !data.id ? Id.generateId().value : data.id;

        return this.validateAndCreate({ ...data, id: finalId });
    }

    public update(
        dataToUpdate: Partial<Omit<VideoData, "id">>
    ): Either<ValidationError<VideoValidationTypes>[], Video> {
        const newData = { ...this.toData(), ...dataToUpdate };

        return Video.validateAndCreate(newData);
    }

    public toData(): VideoData {
        return {
            id: this.id.value,
            links: this.links.map(link => ({ id: link.id, type: link.type })),
            title: this.title,
            subtitle: this.subtitle,
            description: this.description,
            competitors: this.competitors.map(id => id.value),
            eventDate: this.eventDate,
            createdDate: this.createdDate,
            order: this.order,
        };
    }

    private static validateAndCreate(
        data: VideoData
    ): Either<ValidationError<VideoValidationTypes>[], Video> {
        const idResult = Id.createExisted(data.id);
        const competitorResults = data.competitors
            ? data.competitors.map(id => Id.createExisted(id))
            : undefined;

        const linksResults = data.links
            ? data.links.map(linkData => {
                  return VideoLink.create(linkData);
              })
            : undefined;

        const linkErrors: ValidationError<VideoLinkData>[] = linksResults
            ? linksResults
                  .map(linkResult =>
                      linkResult.fold(
                          errors => errors,
                          () => []
                      )
                  )
                  .flat()
            : [];

        const competitorErrors = competitorResults
            ? competitorResults.map(competitorResult => {
                  return {
                      property: "competitors" as const,
                      errors: competitorResult.fold(
                          errors => errors,
                          () => []
                      ),
                      value: data.competitors,
                      type: Video.name,
                  };
              })
            : [];

        const videoErrors: ValidationError<VideoData>[] = [
            {
                property: "title" as const,
                errors: validateRequired(data.title),
                value: data.title,
            },
            {
                property: "subtitle" as const,
                errors: validateRequired(data.subtitle),
                value: data.subtitle,
            },
            {
                property: "description" as const,
                errors: validateRequired(data.description),
                value: data.description,
            },
            {
                property: "competitors" as const,
                errors: validateRequired(data.competitors),
                value: data.competitors,
            },
            {
                property: "links" as const,
                errors: validateRequired(data.links),
                value: data.links,
            },
            {
                property: "id" as const,
                errors: idResult.fold(
                    errors => errors,
                    () => []
                ),
                value: data.id,
            },
        ].map(error => ({ ...error, type: Video.name }));

        const errors = [...videoErrors, ...linkErrors, ...competitorErrors].filter(
            validation => validation.errors.length > 0
        );

        if (errors.length === 0) {
            return Either.right(
                new Video({
                    id: idResult.get(),
                    links: linksResults.map(result => result.get()),
                    title: data.title,
                    description: data.description,
                    subtitle: data.subtitle,
                    competitors: competitorResults.map(result => result.get()),
                    eventDate: data.eventDate,
                    createdDate: data.createdDate,
                    order: data.order,
                })
            );
        } else {
            return Either.left(errors);
        }
    }
}
