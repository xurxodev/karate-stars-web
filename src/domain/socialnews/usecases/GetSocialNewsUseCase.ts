import SocialNewsRepository from "../boundaries/SocialNewsRepository";
import {SocialNews} from "../entities/SocialNews";

export default class GetSocialNewsUseCase {
    private repository: SocialNewsRepository;

    constructor(resository: SocialNewsRepository) {
        this.repository = resository;
    }

    public execute(): Promise<SocialNews[]>  {
        return this.repository.get();
    }
}
