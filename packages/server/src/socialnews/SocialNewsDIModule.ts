import { MongoConector } from "../common/data/MongoConector";
import { di } from "../CompositionRoot";
import SocialNewsController from "./api/SocialNewsController";
import SociaNewsMongoRepository from "./data/SocialNewsMongoRepository";
import GetSocialNewsUseCase from "./domain/usecases/GetSocialNewsUseCase";

export const socialNewsDIKeys = {
    socialNewsRepository: "socialNewsRepository",
};

export function initializeSocialNews() {
    di.bindLazySingleton(socialNewsDIKeys.socialNewsRepository, () => {
        return new SociaNewsMongoRepository(di.get(MongoConector));
    });

    di.bindLazySingleton(
        GetSocialNewsUseCase,
        () => new GetSocialNewsUseCase(di.get(socialNewsDIKeys.socialNewsRepository))
    );

    di.bindFactory(
        SocialNewsController,
        () => new SocialNewsController(di.get(GetSocialNewsUseCase))
    );
}
