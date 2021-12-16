import { SocialNews, SocialUser } from "../domain/entities/SocialNews";
import { user, getUserMeta, hashtag } from "instatouch";
import { Options, PostCollector } from "instatouch/build/types";
import SocialNewsDataSource from "./SocialNewsDataSource";
import moment from "moment";

export default class SocialNewsInstagramDataSource implements SocialNewsDataSource {
    private users: string[];
    private sessionId: string;

    constructor() {
        const envUsers = process.env.INSTAGRAM_USERS;
        this.sessionId = process.env.INSTAGRAM_SESSIONID || "";

        this.users = envUsers ? envUsers.split(",") : ["worldkaratefederation", "karatestarsapp"];
    }

    public async get(_search: string): Promise<SocialNews[]> {
        try {
            const options: Options = {
                count: 50,
                session: `sessionid=${this.sessionId}`,
            };

            const byUser = (
                await Promise.all(
                    this.users.map(async user => this.getSocialNewsByUser(user, options))
                )
            ).flat();

            const news = byUser.filter(n => moment(new Date()).diff(n.summary.date, "days") <= 30);

            console.log({ totalInstagram: news.length });

            //By tag is not possible extract user image and username
            // const byTag = await this.getSocialNewsByHashtag(
            //     search.replace("#", "").toLowerCase(),
            //     options
            // );

            //const news = [...byUser, ...byTag];

            //return this.removeDuplicates(news);

            return news;
        } catch (error) {
            console.log(`Instagram error: ${error}`);
            return [];
        }
    }

    public async getSocialNewsByUser(username: string, options: Options): Promise<SocialNews[]> {
        const socialUser = await this.getSocialUser(username, options);

        const posts = await user(username, options);

        const socialNews = posts.collector.map((media: PostCollector) =>
            this.mapMedia(socialUser, media)
        );

        console.log({ username, count: socialNews.length });

        return socialNews;
    }

    public async getSocialNewsByHashtag(tag: string, options: Options): Promise<SocialNews[]> {
        const posts = await hashtag(tag.replace("#", ""), options);

        const userNames: string[] = posts.collector.reduce((acc, post) => {
            return post.owner !== undefined ? [...acc, post.owner.id] : acc;
        }, [] as string[]);

        console.log({ userNames });

        const socialUsers = (
            await Promise.all(
                userNames.map(async userName => this.getSocialUser(userName, options))
            )
        ).flat();

        console.log({ socialUsers });

        const socialNews = posts.collector.reduce((acc, post) => {
            const socialUser = socialUsers.find(user => user.userName === post.owner?.username);

            if (socialUser === undefined) return acc;

            const socialNews = this.mapMedia(socialUser, post);

            return [...acc, socialNews];
        }, [] as SocialNews[]);

        console.log({ tag: tag, count: socialNews.length });

        return socialNews;
    }

    private mapMedia(socialUser: SocialUser, media: PostCollector): SocialNews {
        const date = new Date(
            media.taken_at_timestamp ? new Date(media.taken_at_timestamp * 1000) : new Date()
        ).toISOString();

        const image = !media.is_video ? media.display_url : undefined;

        const video = media.is_video ? media.video_url : undefined;

        const url = `https://www.instagram.com/p/${media.shortcode}`;

        return {
            network: "instagram",
            summary: {
                title: media.description ?? "",
                image,
                video,
                date,
                link: url,
            },
            user: socialUser,
        };
    }

    private removeDuplicates(sumSocialNews: SocialNews[]): SocialNews[] {
        const uniq = new Set(sumSocialNews.map(e => JSON.stringify(e)));

        return Array.from(uniq).map(e => JSON.parse(e));
    }

    async getSocialUser(username: string, options: Options): Promise<SocialUser> {
        const userMeta = await getUserMeta(username, options);
        const socialUser = {
            name: userMeta.graphql.user.full_name,
            userName: userMeta.graphql.user.username,
            image: userMeta.graphql.user.profile_pic_url,
            url: `https://www.instagram.com/${userMeta.graphql.user.username}`,
        };
        return socialUser;
    }
}
