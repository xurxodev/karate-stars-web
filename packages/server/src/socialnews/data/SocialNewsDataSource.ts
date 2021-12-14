import { SocialNews } from "../domain/entities/SocialNews";

export default interface SocialNewsDataSource {
    get(hastag: string): Promise<SocialNews[]>;
}
