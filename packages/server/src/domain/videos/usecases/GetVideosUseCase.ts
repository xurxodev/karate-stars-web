import VideoRepository from "../boundaries/VideoRepository";
import { Video } from "../entities/Video";

export default class GetVideosUseCase {
    private repository: VideoRepository;

    constructor(resository: VideoRepository) {
        this.repository = resository;
    }

    public execute(): Promise<Video[]> {
        return this.repository.get();
    }
}
