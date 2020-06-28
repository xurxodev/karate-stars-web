import Parser from "rss-parser";
import CurrentNewsRepository from "../../domain/currentnews/boundaries/CurrentNewsRepository";
import { CurrentNews } from "../../domain/currentnews/entities/CurrentNews";
import { NewsFeed } from "../../domain/settings/entities/Settings";

export default class CurrentNewsRSSRepository implements CurrentNewsRepository {
    public parser = new Parser();

    public get(feeds: NewsFeed[]): Promise<CurrentNews[]> {
        return new Promise((resolve, reject) => {
            Promise.all(feeds.map(feed => this.getNewsFromFeed(feed)))
                .then((res: any[]) => {
                    const mergedSocialNews = [].concat(...res);

                    resolve(
                        mergedSocialNews.filter((sn: any) =>
                            this.isLastMonth(Date.parse(sn.summary.date))
                        )
                    );
                })
                .catch(err => {
                    reject(err);
                    console.log(err);
                });
        });
    }

    public isLastMonth(newsDate: number): boolean {
        const diffTime = Math.abs(Date.now() - newsDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays < 30;
    }

    private async getNewsFromFeed(feed: NewsFeed): Promise<any[]> {
        let rss: any;
        try {
            rss = await this.parser.parseURL(feed.url.value);

            if (rss && rss.items) {
                return rss?.items?.map((item: any) => this.mapItem(item, feed)) ?? [];
            } else {
                console.log(`There are not rss items to parse in ${feed.url}`);
                return [];
            }
        } catch (error) {
            console.log(`Error parsing feed ${{ feed }}`);
            console.log({ rss });
            return [];
        }
    }

    private getImage(item: any): string {
        let image;

        if (item && item.content) {
            image = this.extractImage(item.content);
        }

        if (!image && item && item["content:encoded"]) {
            image = this.extractImage(item["content:encoded"]);
        }

        return image ?? "";
    }

    private extractImage(text: string) {
        let image = "";

        if (text) {
            const matched = text.match('srcs*=s*"(.+?)"');

            if (matched) {
                image = matched[1];
            }
        }

        return image;
    }

    private mapItem(item: any, feed: NewsFeed): CurrentNews {
        const date = new Date(Date.parse(item.pubDate)).toISOString();

        let image = "";
        try {
            image = this.getImage(item);
        } catch (error) {
            console.log(error);
        }

        return {
            summary: {
                title: item.title,
                image,
                date,
                link: item.link,
            },
            source: {
                name: feed.name,
                image: feed.image.value,
                url: feed.url.value,
            },
        };
    }
}
