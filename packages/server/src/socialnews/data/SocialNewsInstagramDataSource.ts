import SocialNewsRepository from "../domain/boundaries/SocialNewsRepository";
import { SocialNews, SocialUser } from "../domain/entities/SocialNews";
import fetch from "node-fetch";

export default class SocialNewsInstagramDataSource implements SocialNewsRepository {
    constructor() {}

    public async get(): Promise<SocialNews[]> {
        try {
            const socialNewsWKF = await this.getSocialNewsBy("worldkaratefederation");
            const socialNewsKarateStarsApp = await this.getSocialNewsBy("karatestarsapp");

            return [...socialNewsWKF, ...socialNewsKarateStarsApp];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    public async getSocialNewsBy(username: string): Promise<SocialNews[]> {
        const profile = await this.get_instagram_profile(username);

        const socialUser = {
            name: profile.graphql.user.full_name,
            userName: profile.graphql.user.username,
            image: profile.graphql.user.profile_pic_url,
            url: `https://www.instagram.com/${profile.graphql.user.username}`,
        };

        const socialNews = profile.graphql.user.edge_owner_to_timeline_media.edges.map(
            (media: any) => this.mapMedia(socialUser, media)
        );

        return socialNews;
    }

    private mapMedia(socialUser: SocialUser, media: any): SocialNews {
        const date = new Date(new Date(media.node.taken_at_timestamp * 1000)).toISOString();

        const image = !media.node.is_video ? media.node.display_url : undefined;

        const video = media.node.is_video ? media.node.video_url : undefined;

        const url = `https://www.instagram.com/p/${media.node.shortcode}`;

        return {
            network: "instagram",
            summary: {
                title: media.node.edge_media_to_caption.edges[0].node.text,
                image,
                video,
                date,
                link: url,
            },
            user: socialUser,
        };
    }

    async get_instagram_profile(username) {
        const response = await fetch(
            `https://www.instagram.com/${username}/channel/?__a=1`
        ).then(response => response.json());

        return response;
    }
}
