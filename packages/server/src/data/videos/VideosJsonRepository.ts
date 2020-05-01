import fetch from "node-fetch";
import VideoRepository from "../../domain/videos/boundaries/VideoRepository";
import { Video } from "../../domain/videos/entities/Video";

export default class VideosJsonRepository implements VideoRepository {
  public get(): Promise<Video[]> {
    return new Promise((resolve, reject) => {
      this.getCatgories()
        .then((videos: Video[]) => {
          resolve(videos)
        })
        .catch((err) => {
          reject(err);
          console.log(err);
        });
    });
  }

  private async getCatgories(): Promise<Video[]> {
    const response = await fetch("http://www.karatestarsapp.com/api/v1/videos.json");

    return await response.json();
  }
}
