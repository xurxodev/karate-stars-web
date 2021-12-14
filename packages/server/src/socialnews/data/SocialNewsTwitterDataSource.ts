import { SocialNews } from "../domain/entities/SocialNews";
import Twit from "twit";
import SocialNewsDataSource from "./SocialNewsDataSource";

export default class SocialNewsTwitterDataSource implements SocialNewsDataSource {
    private twitterApiClient: Twit;

    constructor(twitterConcomerKey: string, twitterConcomerSecret: string) {
        this.twitterApiClient = new Twit({
            consumer_key: twitterConcomerKey,
            consumer_secret: twitterConcomerSecret,
            timeout_ms: 60 * 1000,
            app_only_auth: true,
        });
    }

    public get(search: string): Promise<SocialNews[]> {
        return new Promise((resolve, reject) => {
            Promise.all([this.getSocialNewsFromList(), this.getSocialNewsFromSearch(search)])
                .then(async ([listResult, searchResult]) => {
                    const listTweets: any = listResult.data;
                    const searchResponse: any = searchResult.data;
                    const searchTweets: any = searchResponse.statuses;

                    const socialNewsList = listTweets.map((tweet: any) => this.mapTweet(tweet));
                    const socialNewsSearch = searchTweets.map((tweet: any) => this.mapTweet(tweet));

                    console.log({ source: "Twitter List", count: socialNewsList.length });
                    console.log({
                        source: `Twitter search ${search}`,
                        count: socialNewsSearch.length,
                    });

                    const sumSocialNews = [...socialNewsList, ...socialNewsSearch];

                    const uniqueSocialNews = this.removeDuplicates(sumSocialNews);

                    console.log({
                        source: "Twitter unique tweets",
                        count: uniqueSocialNews.length,
                    });

                    uniqueSocialNews.sort(
                        (a: SocialNews, b: SocialNews) =>
                            Date.parse(a.summary.date) - Date.parse(b.summary.date)
                    );

                    resolve(uniqueSocialNews);
                })
                .catch(err => {
                    console.log(`Twitter error: ${err}`);
                    return [];
                });
        });
    }
    public removeDuplicates(sumSocialNews: SocialNews[]): SocialNews[] {
        const uniq = new Set(sumSocialNews.map(e => JSON.stringify(e)));

        return Array.from(uniq).map(e => JSON.parse(e));
    }

    private mapTweet(tweet: any) {
        const date = new Date(Date.parse(tweet.created_at)).toISOString();

        const socialUser = {
            name: tweet.user.name,
            userName: tweet.user.screen_name,
            image: tweet.user.profile_image_url,
            url: tweet.user.url ?? `https://twitter.com/${tweet.user.screen_name}`,
        };

        const image = this.getImage(tweet);

        const video = this.getVideo(tweet);

        const url = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id}`;

        return {
            network: "twitter",
            summary: {
                title: tweet.text,
                image,
                video,
                date,
                link: url,
            },
            user: socialUser,
        };
    }

    private getImage(tweet: any) {
        let image;

        if (tweet.entities && tweet.entities.media) {
            const imageMedia = tweet.entities.media.find(media => media.type === "photo");
            image = imageMedia.media_url;
        }

        return image;
    }

    private getVideo(tweet: any) {
        let video;

        if (tweet.extended_entities && tweet.extended_entities.media) {
            const videoMedia = tweet.extended_entities.media.find(media => media.type === "video");

            if (videoMedia && videoMedia.video_info && videoMedia.video_info.variants) {
                const videoVariant = videoMedia.video_info.variants
                    .sort((a, b) => b.bitrate - a.bitrate)
                    .find(variant => variant.content_type === "video/mp4");
                video = videoVariant.url;
            }
        }

        return video;
    }

    private getSocialNewsFromList(): Promise<Twit.PromiseResponse> {
        return this.twitterApiClient.get("lists/statuses", {
            slug: "karate-stars-news",
            owner_screen_name: "karatestarsapp",
            include_rts: false,
            count: 100,
        });
    }

    private async getSocialNewsFromSearch(search: string): Promise<Twit.PromiseResponse> {
        return this.twitterApiClient.get("search/tweets", {
            q: search,
            count: 100,
            include_entities: true,
            result_type: "popular",
        });
    }
}
