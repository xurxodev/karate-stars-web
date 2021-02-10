import { SocialNews } from "../entities/SocialNews";

export default interface SocialNewsRepository<> {
    get(search: string): Promise<SocialNews[]>;
}
