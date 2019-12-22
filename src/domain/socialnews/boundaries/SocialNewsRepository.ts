import { SocialNews } from "../entities/SocialNews";

export default interface SocialNewsRepository<> {
    get(): Promise<SocialNews[]>;
}
