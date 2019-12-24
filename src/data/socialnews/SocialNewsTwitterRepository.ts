import Twit = require("twit");
import SocialNewsRepository from "../../domain/socialnews/boundaries/SocialNewsRepository";
import { SocialNews, SocialUser } from "../../domain/socialnews/entities/SocialNews";

export default class SocialNewsTwitterRepository implements SocialNewsRepository {
  public twitterApiClient = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY_PROP,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET_PROP,
    // access_token: '...',
    // access_token_secret: '...',
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
    // strictSSL: true,     // optional - requires SSL certificates to be valid.
    app_only_auth: true
  });

  public get(): Promise<SocialNews[]> {
    return new Promise((resolve, reject) => {
      this.getSocialNewsFromList()
        .then((listResult) => {
          // `result` is an Object with keys "data" and "resp".
          // `data` and `resp` are the same objects as the ones passed
          // to the callback.
          // See https://github.com/ttezel/twit#tgetpath-params-callback
          // for details.

          const tweets: any = listResult.data;

          const socialNewsList = tweets.map((tweet: any) => this.mapTweet(tweet));

          resolve(socialNewsList);
        })
        .catch((err) => {
          console.log("caught error", err.stack);
        });
    });
  }

  private mapTweet(tweet: any) {
    const date = new Date(Date.parse(tweet.created_at)).toISOString();

    const socialUser = {
      name: tweet.user.name,
      userName: tweet.user.screen_name,
      image: tweet.user.profile_image_url,
      url: tweet.user.url
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
        link: url
      },
      user: socialUser
    };
  }

  private getImage(tweet: any) {
    let image;

    if (tweet.entities && tweet.entities.media) {
      const imageMedia = tweet.entities.media.find((media) => media.type === "photo");
      image = imageMedia.media_url;
    }

    return image;
  }

  private getVideo(tweet: any) {
    let video;

    if (tweet.extended_entities && tweet.extended_entities.media) {
      const videoMedia = tweet.extended_entities.media.find((media) => media.type === "video");

      if (videoMedia && videoMedia.video_info && videoMedia.video_info.variants) {
        const videoVariant = videoMedia.video_info.variants
          .sort((variant) => variant.bitrate)
          .find((variant) => variant.content_type === "video/mp4");
        video = videoVariant.url;
      }
    }

    return video;
  }

  private getSocialNewsFromList(): Promise<Twit.PromiseResponse> {
    return this.twitterApiClient.get("lists/statuses",
      { slug: "karate-stars-news", owner_screen_name: "karatestarsapp", include_rts: false })
      // this.twitterApiClient.get("search/tweets", { q: "#Karate1Madrid", count: 100,
      // include_entities: true, result_type: "popular" })
      ;
  }
}
