import axios from "axios";
import moment from "moment";
import { SocialNews, SocialUser } from "../../socialnews/domain/entities/SocialNews";
import SocialNewsDataSource from "../importers/socialNewsImporter";

export default class SocialNewsInstagramDirectDataSource implements SocialNewsDataSource {
    private users: string[];
    private sessionId: string;

    constructor() {
        const envUsers = process.env.INSTAGRAM_USERS;
        this.sessionId = process.env.INSTAGRAM_SESSIONID || "";

        this.users = envUsers ? envUsers.split(",") : ["worldkaratefederation", "karatestarsapp"];
    }

    public async get(): Promise<SocialNews[]> {
        try {
            const byUser = (
                await Promise.all(this.users.map(async user => this.getSocialNewsByUser(user)))
            ).flat();

            const news = byUser.filter(n => moment(new Date()).diff(n.summary.date, "days") <= 30);
            //const news = [];
            console.log({ totalInstagram: news.length });

            return [];
        } catch (error) {
            console.log(`Instagram error: ${error}`);
            return [];
        }
    }

    public async getSocialNewsByUser(username: string): Promise<SocialNews[]> {
        const profile = await this.getInstagramProfile(username);

        const socialUser = {
            name: profile.graphql.user.full_name,
            userName: profile.graphql.user.username,
            image: profile.graphql.user.profile_pic_url,
            url: `https://www.instagram.com/${profile.graphql.user.username}`,
        };

        const socialNews = profile.graphql.user.edge_owner_to_timeline_media.edges.map(media =>
            this.mapMedia(socialUser, media)
        );

        console.log({ username, count: socialNews.length });

        return socialNews;
    }

    async getInstagramProfile(username: string): Promise<InstaObject> {
        const response = await axios.get(`https://www.instagram.com/${username}?__a=1`, {
            headers: {
                cookie: `sessionid=${this.sessionId};`,
            },
        });

        return response.data;
    }

    private mapMedia(socialUser: SocialUser, media: Edge3): SocialNews {
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
}

export interface EdgeFollowedBy {
    count: number;
}

export interface EdgeFollow {
    count: number;
}

export interface EdgeMutualFollowedBy {
    count: number;
    edges: any[];
}

export interface PageInfo {
    has_next_page: boolean;
    end_cursor: string;
}

export interface Dimensions {
    height: number;
    width: number;
}

export interface EdgeMediaToTaggedUser {
    edges: any[];
}

export interface SharingFrictionInfo {
    should_have_sharing_friction: boolean;
    bloks_app_url?: any;
}

export interface Owner {
    id: string;
    username: string;
}

export interface DashInfo {
    is_dash_eligible: boolean;
    video_dash_manifest?: any;
    number_of_qualities: number;
}

export interface Node2 {
    text: string;
}

export interface Edge2 {
    node: Node2;
}

export interface EdgeMediaToCaption {
    edges: Edge2[];
}

export interface EdgeMediaToComment {
    count: number;
}

export interface EdgeLikedBy {
    count: number;
}

export interface EdgeMediaPreviewLike {
    count: number;
}

export interface ThumbnailResource {
    src: string;
    config_width: number;
    config_height: number;
}

export interface Node {
    __typename: string;
    id: string;
    shortcode: string;
    dimensions: Dimensions;
    display_url: string;
    edge_media_to_tagged_user: EdgeMediaToTaggedUser;
    fact_check_overall_rating?: any;
    fact_check_information?: any;
    gating_info?: any;
    sharing_friction_info: SharingFrictionInfo;
    media_overlay_info?: any;
    media_preview?: any;
    owner: Owner;
    is_video: boolean;
    has_upcoming_event: boolean;
    accessibility_caption?: any;
    dash_info: DashInfo;
    has_audio: boolean;
    tracking_token: string;
    video_url: string;
    video_view_count: number;
    edge_media_to_caption: EdgeMediaToCaption;
    edge_media_to_comment: EdgeMediaToComment;
    comments_disabled: boolean;
    taken_at_timestamp: number;
    edge_liked_by: EdgeLikedBy;
    edge_media_preview_like: EdgeMediaPreviewLike;
    location?: any;
    thumbnail_src: string;
    thumbnail_resources: ThumbnailResource[];
    felix_profile_grid_crop?: any;
    coauthor_producers: any[];
    encoding_status?: any;
    is_published: boolean;
    product_type: string;
    title: string;
    video_duration: number;
}

export interface Edge {
    node: Node;
}

export interface EdgeFelixVideoTimeline {
    count: number;
    page_info: PageInfo;
    edges: Edge[];
}

export interface PageInfo2 {
    has_next_page: boolean;
    end_cursor: string;
}

export interface Dimensions2 {
    height: number;
    width: number;
}

export interface EdgeMediaToTaggedUser2 {
    edges: any[];
}

export interface SharingFrictionInfo2 {
    should_have_sharing_friction: boolean;
    bloks_app_url?: any;
}

export interface Owner2 {
    id: string;
    username: string;
}

export interface Node4 {
    text: string;
}

export interface Edge4 {
    node: Node4;
}

export interface EdgeMediaToCaption2 {
    edges: Edge4[];
}

export interface EdgeMediaToComment2 {
    count: number;
}

export interface EdgeLikedBy2 {
    count: number;
}

export interface EdgeMediaPreviewLike2 {
    count: number;
}

export interface ThumbnailResource2 {
    src: string;
    config_width: number;
    config_height: number;
}

export interface DashInfo2 {
    is_dash_eligible: boolean;
    video_dash_manifest?: any;
    number_of_qualities: number;
}

export interface Dimensions3 {
    height: number;
    width: number;
}

export interface EdgeMediaToTaggedUser3 {
    edges: any[];
}

export interface SharingFrictionInfo3 {
    should_have_sharing_friction: boolean;
    bloks_app_url?: any;
}

export interface Owner3 {
    id: string;
    username: string;
}

export interface DashInfo3 {
    is_dash_eligible: boolean;
    video_dash_manifest?: any;
    number_of_qualities: number;
}

export interface Node5 {
    __typename: string;
    id: string;
    shortcode: string;
    dimensions: Dimensions3;
    display_url: string;
    edge_media_to_tagged_user: EdgeMediaToTaggedUser3;
    fact_check_overall_rating?: any;
    fact_check_information?: any;
    gating_info?: any;
    sharing_friction_info: SharingFrictionInfo3;
    media_overlay_info?: any;
    media_preview: string;
    owner: Owner3;
    is_video: boolean;
    has_upcoming_event: boolean;
    accessibility_caption: string;
    dash_info: DashInfo3;
    has_audio?: boolean;
    tracking_token: string;
    video_url: string;
    video_view_count?: number;
}

export interface Edge5 {
    node: Node5;
}

export interface EdgeSidecarToChildren {
    edges: Edge5[];
}

export interface Node3 {
    __typename: string;
    id: string;
    shortcode: string;
    dimensions: Dimensions2;
    display_url: string;
    edge_media_to_tagged_user: EdgeMediaToTaggedUser2;
    fact_check_overall_rating?: any;
    fact_check_information?: any;
    gating_info?: any;
    sharing_friction_info: SharingFrictionInfo2;
    media_overlay_info?: any;
    media_preview: string;
    owner: Owner2;
    is_video: boolean;
    has_upcoming_event: boolean;
    accessibility_caption: string;
    edge_media_to_caption: EdgeMediaToCaption2;
    edge_media_to_comment: EdgeMediaToComment2;
    comments_disabled: boolean;
    taken_at_timestamp: number;
    edge_liked_by: EdgeLikedBy2;
    edge_media_preview_like: EdgeMediaPreviewLike2;
    location?: any;
    thumbnail_src: string;
    thumbnail_resources: ThumbnailResource2[];
    coauthor_producers: any[];
    dash_info: DashInfo2;
    has_audio?: boolean;
    tracking_token: string;
    video_url: string;
    video_view_count?: number;
    felix_profile_grid_crop?: any;
    product_type: string;
    clips_music_attribution_info?: any;
    edge_sidecar_to_children: EdgeSidecarToChildren;
}

export interface Edge3 {
    node: Node3;
}

export interface EdgeOwnerToTimelineMedia {
    count: number;
    page_info: PageInfo2;
    edges: Edge3[];
}

export interface PageInfo3 {
    has_next_page: boolean;
    end_cursor?: any;
}

export interface EdgeSavedMedia {
    count: number;
    page_info: PageInfo3;
    edges: any[];
}

export interface PageInfo4 {
    has_next_page: boolean;
    end_cursor?: any;
}

export interface EdgeMediaCollections {
    count: number;
    page_info: PageInfo4;
    edges: any[];
}

export interface Node6 {
    id: string;
    full_name: string;
    is_private: boolean;
    is_verified: boolean;
    profile_pic_url: string;
    username: string;
}

export interface Edge6 {
    node: Node6;
}

export interface EdgeRelatedProfiles {
    edges: Edge6[];
}

export interface User {
    biography: string;
    blocked_by_viewer: boolean;
    restricted_by_viewer?: any;
    country_block: boolean;
    external_url: string;
    external_url_linkshimmed: string;
    edge_followed_by: EdgeFollowedBy;
    fbid: string;
    followed_by_viewer: boolean;
    edge_follow: EdgeFollow;
    follows_viewer: boolean;
    full_name: string;
    has_ar_effects: boolean;
    has_clips: boolean;
    has_guides: boolean;
    has_channel: boolean;
    has_blocked_viewer: boolean;
    highlight_reel_count: number;
    has_requested_viewer: boolean;
    hide_like_and_view_counts: boolean;
    id: string;
    is_business_account: boolean;
    is_professional_account: boolean;
    is_supervision_enabled: boolean;
    is_guardian_of_viewer: boolean;
    is_supervised_by_viewer: boolean;
    is_embeds_disabled: boolean;
    is_joined_recently: boolean;
    business_address_json?: any;
    business_contact_method: string;
    business_email?: any;
    business_phone_number?: any;
    business_category_name: string;
    overall_category_name?: any;
    category_enum: string;
    category_name: string;
    is_private: boolean;
    is_verified: boolean;
    edge_mutual_followed_by: EdgeMutualFollowedBy;
    profile_pic_url: string;
    profile_pic_url_hd: string;
    requested_by_viewer: boolean;
    should_show_category: boolean;
    should_show_public_contacts: boolean;
    state_controlled_media_country?: any;
    username: string;
    connected_fb_page?: any;
    pronouns: any[];
    edge_felix_video_timeline: EdgeFelixVideoTimeline;
    edge_owner_to_timeline_media: EdgeOwnerToTimelineMedia;
    edge_saved_media: EdgeSavedMedia;
    edge_media_collections: EdgeMediaCollections;
    edge_related_profiles: EdgeRelatedProfiles;
}

export interface Graphql {
    user: User;
}

export interface InstaObject {
    seo_category_infos: string[][];
    logging_page_id: string;
    show_suggested_profiles: boolean;
    graphql: Graphql;
    toast_content_on_load?: any;
    show_qr_modal: boolean;
    show_view_shop: boolean;
}
