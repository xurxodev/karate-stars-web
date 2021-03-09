import { Either } from "../../types/Either";
import { ValidationError } from "../../types/Errors";
import { validateRequired } from "../../utils/validations";
import { Id } from "../../value-objects/Id";
import { Url } from "../../value-objects/Url";
import { Entity, EntityData, EntityRawData } from "../Entity";
import { Achievement, AchievementData, AchievementRawData } from "./Achievement";
import { SocialLink, SocialLinkData, SocialLinkRawData } from "./SocialLink";

export interface CompetitorRawData extends EntityRawData {
    firstName: string;
    lastName: string;
    wkfId: string;
    biography: string;
    countryId: string;
    categoryId: string;
    mainImage?: string;
    isActive: boolean;
    isLegend: boolean;
    links: SocialLinkRawData[];
    achievements: AchievementRawData[];
}

export interface CompetitorData extends EntityData {
    firstName: string;
    lastName: string;
    wkfId: string;
    biography: string;
    countryId: string;
    categoryId: Id;
    mainImage?: Url;
    isActive: boolean;
    isLegend: boolean;
    links: SocialLink[];
    achievements: Achievement[];
}

export type ValidationTypes = CompetitorData & AchievementData & SocialLinkData;

export class Competitor
    extends Entity<CompetitorData, CompetitorRawData>
    implements CompetitorData {
    public readonly firstName: string;
    public readonly lastName: string;
    public readonly wkfId: string;
    public readonly biography: string;
    public readonly countryId: string;
    public readonly categoryId: Id;
    public readonly mainImage: Url;
    public readonly isActive: boolean;
    public readonly isLegend: boolean;
    public readonly links: SocialLink[];
    public readonly achievements: Achievement[];

    private constructor(data: CompetitorData) {
        super(data.id);

        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.wkfId = data.wkfId;
        this.biography = data.biography;
        this.countryId = data.countryId;
        this.categoryId = data.categoryId;
        this.mainImage = data.mainImage;
        this.isActive = data.isActive;
        this.isLegend = data.isLegend;
        this.links = data.links;
        this.achievements = data.achievements;
    }

    public static create(
        data: CompetitorRawData
    ): Either<ValidationError<ValidationTypes>[], Competitor> {
        const finalId = !data.id ? Id.generateId().value : data.id;

        return this.validateAndCreate({ ...data, id: finalId });
    }

    public update(
        dataToUpdate: Partial<Omit<CompetitorRawData, "id">>
    ): Either<ValidationError<ValidationTypes>[], Competitor> {
        const newData = { ...this.toRawData(), ...dataToUpdate };

        return Competitor.validateAndCreate(newData);
    }

    public toRawData(): CompetitorRawData {
        return {
            id: this.id.value,
            firstName: this.firstName,
            lastName: this.lastName,
            wkfId: this.wkfId,
            biography: this.biography,
            countryId: this.countryId,
            categoryId: this.categoryId.value,
            mainImage: this.mainImage.value,
            isActive: this.isActive,
            isLegend: this.isLegend,
            links: this.links.map(link => {
                return {
                    url: link.url.value,
                    type: link.type,
                };
            }),
            achievements: this.achievements.map(achievement => {
                return {
                    eventId: achievement.eventId.value,
                    categoryId: achievement.categoryId.value,
                    position: achievement.position,
                };
            }),
        };
    }

    private static validateAndCreate(
        data: CompetitorRawData
    ): Either<ValidationError<ValidationTypes>[], Competitor> {
        const idResult = Id.createExisted(data.id);
        const mainImageResult = data.mainImage ? Url.create(data.mainImage, true) : undefined;
        const categoryIdResult = Id.createExisted(data.categoryId);
        const achievementsResult = data.achievements.map(achievementData => {
            return Achievement.create(achievementData);
        });
        const linksResult = data.links.map(linkData => {
            return SocialLink.create(linkData);
        });

        const achievementsRequiredError = {
            property: "achievements" as const,
            errors: validateRequired(data.achievements),
            value: data.achievements,
        };

        const achievementsErrors = achievementsResult
            .map(achievementResult => {
                return achievementResult.fold(
                    errors => errors,
                    () => []
                );
            })
            .flat();

        const linksErrors = linksResult
            .map(linkResult => {
                return linkResult.fold(
                    errors => errors,
                    () => []
                );
            })
            .flat();

        const errors: ValidationError<CompetitorData & AchievementData & SocialLinkData>[] = [
            ...[
                {
                    property: "id" as const,
                    errors: idResult.fold(
                        errors => errors,
                        () => []
                    ),
                    value: data.id,
                },
                {
                    property: "firstName" as const,
                    errors: validateRequired(data.firstName),
                    value: data.firstName,
                },
                {
                    property: "lastName" as const,
                    errors: validateRequired(data.lastName),
                    value: data.lastName,
                },
                {
                    property: "wkfId" as const,
                    errors: validateRequired(data.wkfId),
                    value: data.wkfId,
                },
                {
                    property: "biography" as const,
                    errors: validateRequired(data.biography),
                    value: data.biography,
                },
                {
                    property: "countryId" as const,
                    errors: validateRequired(data.countryId),
                    value: data.countryId,
                },
                {
                    property: "categoryId" as const,
                    errors: categoryIdResult.fold(
                        errors => errors,
                        () => []
                    ),
                    value: data.categoryId,
                },
                {
                    property: "mainImage" as const,
                    errors: mainImageResult
                        ? mainImageResult.fold(
                              errors => errors,
                              () => []
                          )
                        : [],
                    value: data.mainImage,
                },
            ].map(error => ({ ...error, type: Competitor.name })),
            achievementsRequiredError,
            ...achievementsErrors,
            ...linksErrors,
        ].filter(validation => validation.errors.length > 0);

        if (errors.length === 0) {
            return Either.right(
                new Competitor({
                    id: idResult.get(),
                    firstName: data.firstName,
                    lastName: data.lastName,
                    wkfId: data.wkfId,
                    biography: data.biography,
                    countryId: data.countryId,
                    categoryId: categoryIdResult.get(),
                    mainImage: data.mainImage ? mainImageResult.get() : undefined,
                    isActive: data.isActive,
                    isLegend: data.isLegend,
                    links: linksResult.map(result => {
                        return result.get();
                    }),
                    achievements: achievementsResult.map(result => {
                        return result.get();
                    }),
                })
            );
        } else {
            return Either.left(errors);
        }
    }
}
