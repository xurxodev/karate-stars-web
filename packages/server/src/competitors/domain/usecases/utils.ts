import {
    Either,
    Competitor,
    ValidationTypes,
    ValidationError,
    Achievement,
} from "karate-stars-core";
import CategoryRepository from "../../../categories/domain/boundaries/CategoryRepository";
import CountryRepository from "../../../countries/domain/boundaries/CountryRepository";
import EventRepository from "../../../events/domain/boundaries/EventRepository";

export async function validateCompetitorDependencies(
    entity: Competitor,
    categoryRepository: CategoryRepository,
    countryRepository: CountryRepository,
    eventRepository: EventRepository
): Promise<Either<ValidationError<ValidationTypes>[], Competitor>> {
    const competitorCategory = (await categoryRepository.getById(entity.categoryId)).mapLeft(() => [
        {
            property: "categoryId" as const,
            errors: ["invalid_dependency"],
            type: Competitor.name,
            value: entity.categoryId,
        } as ValidationError<ValidationTypes>,
    ]);

    const competitorCountry = (await countryRepository.getById(entity.countryId)).mapLeft(() => [
        {
            property: "countryId" as const,
            errors: ["invalid_dependency"],
            type: Competitor.name,
            value: entity.countryId,
        } as ValidationError<ValidationTypes>,
    ]);

    const achievementsCategories = await Promise.all(
        entity.achievements.map(async achievement => {
            return (await categoryRepository.getById(achievement.categoryId)).mapLeft(() => [
                {
                    property: "categoryId" as const,
                    errors: ["invalid_dependency"],
                    type: Achievement.name,
                    value: achievement.categoryId,
                } as ValidationError<ValidationTypes>,
            ]);
        })
    );

    const achievementsEvents = await Promise.all(
        entity.achievements.map(async achievement => {
            return (await eventRepository.getById(achievement.eventId)).mapLeft(() => [
                {
                    property: "eventId" as const,
                    errors: ["invalid_dependency"],
                    type: Achievement.name,
                    value: achievement.eventId,
                } as ValidationError<ValidationTypes>,
            ]);
        })
    );

    const allValidationResults = [
        competitorCategory,
        competitorCountry,
        ...achievementsEvents,
        ...achievementsCategories,
    ];

    const errorsResults = allValidationResults.filter(result => result.isLeft());

    const errorResultsData = errorsResults.map(result => result.getLeft()).flat();

    return errorsResults.length > 0 ? Either.left(errorResultsData) : Either.right(entity);
}
