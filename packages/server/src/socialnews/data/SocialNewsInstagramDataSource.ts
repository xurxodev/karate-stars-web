import SocialNewsRepository from "../domain/boundaries/SocialNewsRepository";
import { SocialNews, SocialUser } from "../domain/entities/SocialNews";
import { user, getUserMeta } from "instatouch";
import { PostCollector } from "instatouch/build/types";
//const instaTouch = require("instatouch");

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
        // const profile = await this.get_instagram_profile(username);

        // const socialUser = {
        //     name: profile.graphql.user.full_name,
        //     userName: profile.graphql.user.username,
        //     image: profile.graphql.user.profile_pic_url,
        //     url: `https://www.instagram.com/${profile.graphql.user.username}`,
        // };

        // const socialNews = profile.graphql.user.edge_owner_to_timeline_media.edges.map(
        //     (media: any) => this.mapMedia(socialUser, media)
        // );

        try {
            const options = { count: 10, session: "sessionid=4565290142%3AiNbfZeKnoYDuhF%3A17" };

            const userMeta = await getUserMeta(username, options);
            const socialUser = {
                name: userMeta.graphql.user.full_name,
                userName: userMeta.graphql.user.username,
                image: userMeta.graphql.user.profile_pic_url,
                url: `https://www.instagram.com/${userMeta.graphql.user.username}`,
            };

            const posts = await user(username, options);

            const socialNews = posts.collector.map((media: PostCollector) =>
                this.mapMedia(socialUser, media)
            );
            return socialNews;
        } catch (error) {
            console.log(error);
            return [];
        }
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

    // async get_instagram_profile(username) {
    //     const response = await fetch(`https://www.instagram.com/${username}/channel/?__a=1`, {
    //         headers: {
    //             "User-Agent":
    //                 "Instagram 85.0.0.21.100 Android (23/6.0.1; 538dpi; 1440x2560; LGE; LG-E425f; vee3e; en_US)",
    //         },
    //     }).then(response => response.json());

    //     return response;
    // }

    // async get_instagram_profile(username) {
    //     const userInfoSource = await fetch(`https://www.instagram.com/${username}/`, {
    //         headers: {
    //             "User-Agent":
    //                 "Instagram 85.0.0.21.100 Android (23/6.0.1; 538dpi; 1440x2560; LGE; LG-E425f; vee3e; en_US)",
    //         },
    //     }).then(response => response.text());

    //     const maches = userInfoSource.match(
    //         /<script type="text\/javascript">window\._sharedData = (.*)<\/script>/
    //     );
    //     const jsonObject = maches ? maches[1].slice(0, -1) : "";

    //     debugger;
    //     const userInfo = JSON.parse(jsonObject);

    //     return userInfo.entry_data.ProfilePage[0];
    // }
}
