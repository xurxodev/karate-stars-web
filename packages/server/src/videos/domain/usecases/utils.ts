import { Either, Video, ValidationError, VideoValidationTypes } from "karate-stars-core";
import CompetitorRepository from "../../../competitors/domain/boundaries/CompetitorRepository";

export async function validateVideoDependencies(
    entity: Video,
    competitorRepository: CompetitorRepository
): Promise<Either<ValidationError<VideoValidationTypes>[], Video>> {
    const competitorResults = await Promise.all(
        entity.competitors.map(async competitorId => {
            return (await competitorRepository.getById(competitorId)).mapLeft(() => [
                {
                    property: "competitors" as const,
                    errors: ["invalid_dependency"],
                    type: Video.name,
                    value: competitorId,
                } as ValidationError<VideoValidationTypes>,
            ]);
        })
    );

    const errorsResults = competitorResults.filter(result => result.isLeft());

    const errorResultsData = errorsResults.map(result => result.getLeft()).flat();

    return errorsResults.length > 0 ? Either.left(errorResultsData) : Either.right(entity);
}
