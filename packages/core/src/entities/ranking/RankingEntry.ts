import { Either } from "../../types/Either";
import { ValidationError } from "../../types/Errors";
import { validateRequired } from "../../utils/validations";
import { Id } from "../../value-objects/Id";
import { Entity, EntityData, EntityObjectData } from "../Entity";

interface RankingEntryObjectData extends EntityObjectData {
    rankingId: Id;
    rank: number;
    country: string;
    countryCode: string;
    name: string;
    firstName: string;
    lastName: string;
    wkfId: string;
    photo: string;
    totalPoints: number;
    continentalCode: string;
    categoryId: Id;
    categoryWkfId: string;
    createdDate: Date;
}

export interface RankingEntryData extends EntityData {
    rankingId: string;
    rank: number;
    country: string;
    countryCode: string;
    name: string;
    firstName: string;
    lastName: string;
    wkfId: string;
    photo: string | null;
    totalPoints: number;
    continentalCode: string;
    categoryId: string;
    categoryWkfId: string;
}

export class RankingEntry extends Entity<RankingEntryData> implements RankingEntryObjectData {
    public readonly rankingId: Id;
    public readonly rank: number;
    public readonly country: string;
    public readonly countryCode: string;
    public readonly name: string;
    public readonly firstName: string;
    public readonly lastName: string;
    public readonly wkfId: string;
    public readonly photo: string;
    public readonly totalPoints: number;
    public readonly continentalCode: string;
    public readonly categoryId: Id;
    public readonly categoryWkfId: string;
    public readonly createdDate: Date;

    private constructor(data: RankingEntryObjectData) {
        super(data.id);

        this.rankingId = data.rankingId;
        this.rank = data.rank;
        this.country = data.country;
        this.countryCode = data.countryCode;
        this.name = data.name;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.wkfId = data.wkfId;
        this.photo = data.photo;
        this.totalPoints = data.totalPoints;
        this.continentalCode = data.continentalCode;
        this.categoryId = data.categoryId;
        this.categoryWkfId = data.categoryWkfId;
        this.createdDate = data.createdDate;
    }

    public static create(
        data: RankingEntryData
    ): Either<ValidationError<RankingEntryData>[], RankingEntry> {
        const finalId = !data.id ? Id.generateId().value : data.id;

        return this.validateAndCreate({ ...data, id: finalId });
    }

    public update(
        dataToUpdate: Partial<Omit<RankingEntryData, "id">>
    ): Either<ValidationError<RankingEntryData>[], RankingEntry> {
        const newData = { ...this.toData(), ...dataToUpdate };

        return RankingEntry.validateAndCreate(newData);
    }

    public toData(): RankingEntryData {
        return {
            id: this.id.value,
            rankingId: this.rankingId.value,
            rank: this.rank,
            country: this.country,
            countryCode: this.countryCode,
            name: this.name,
            firstName: this.firstName,
            lastName: this.lastName,
            wkfId: this.wkfId,
            photo: this.photo,
            totalPoints: this.totalPoints,
            continentalCode: this.continentalCode,
            categoryId: this.categoryId.value,
            categoryWkfId: this.categoryWkfId,
        };
    }

    private static validateAndCreate(
        data: RankingEntryData
    ): Either<ValidationError<RankingEntryData>[], RankingEntry> {
        const idResult = Id.createExisted(data.id);
        const rankingIdResult = Id.createExisted(data.rankingId);
        const categoryIdResult = Id.createExisted(data.categoryId);

        const errors = [
            {
                property: "id" as const,
                errors: idResult.fold(
                    errors => errors,
                    () => []
                ),
                value: data.id,
            },
            {
                property: "rankingId" as const,
                errors: rankingIdResult.fold(
                    errors => errors,
                    () => []
                ),
                value: data.rankingId,
            },
            {
                property: "categoryId" as const,
                errors: categoryIdResult.fold(
                    errors => errors,
                    () => []
                ),
                value: data.id,
            },
            { property: "rank" as const, errors: validateRequired(data.name), value: data.rank },
            {
                property: "country" as const,
                errors: validateRequired(data.country),
                value: data.country,
            },
            {
                property: "countryCode" as const,
                errors: validateRequired(data.countryCode),
                value: data.countryCode,
            },
            { property: "name" as const, errors: validateRequired(data.name), value: data.name },
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
            { property: "wkfId" as const, errors: validateRequired(data.wkfId), value: data.wkfId },
            {
                property: "totalPoints" as const,
                errors: validateRequired(data.totalPoints),
                value: data.totalPoints,
            },
            {
                property: "continentalCode" as const,
                errors: validateRequired(data.continentalCode),
                value: data.continentalCode,
            },
            {
                property: "categoryWkfId" as const,
                errors: validateRequired(data.categoryWkfId),
                value: data.categoryWkfId,
            },
        ]
            .map(error => ({ ...error, type: RankingEntry.name }))
            .filter(validation => validation.errors.length > 0);

        if (errors.length === 0) {
            return Either.right(
                new RankingEntry({
                    id: idResult.get(),
                    rankingId: rankingIdResult.get(),
                    rank: data.rank,
                    country: data.country,
                    countryCode: data.countryCode,
                    name: data.name,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    wkfId: data.wkfId,
                    photo: data.photo,
                    totalPoints: data.totalPoints,
                    continentalCode: data.continentalCode,
                    categoryId: categoryIdResult.get(),
                    categoryWkfId: data.categoryWkfId,
                    createdDate: new Date(),
                })
            );
        } else {
            return Either.left(errors);
        }
    }
}
