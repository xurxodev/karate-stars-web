import { Video } from "../entities/Video";

export default interface VideoRepository {
    get(): Promise<Video[]>;
}
