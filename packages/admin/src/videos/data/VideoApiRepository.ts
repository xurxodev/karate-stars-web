import { VideoRepository } from "../domain/Boundaries";
import { VideoData, Video } from "karate-stars-core";
import ApiRepository from "../../common/data/ApiRepository";
import { AxiosInstance } from "axios";
import { TokenStorage } from "../../common/data/TokenLocalStorage";

class VideoApiRepository extends ApiRepository<Video, VideoData> implements VideoRepository {
    constructor(axiosInstance: AxiosInstance, tokenStorage: TokenStorage) {
        super(axiosInstance, tokenStorage, "videos");
    }

    protected mapToDomain(data: VideoData): Video {
        return Video.create(data).get();
    }
}

export default VideoApiRepository;
