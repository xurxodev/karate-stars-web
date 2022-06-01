import { NewsFeed } from "karate-stars-core";
import Parser from "rss-parser";
import { CurrentNews } from "../../currentnews/domain/entities/CurrentNews";
import CurrentNewsDataSource from "../importers/currentNewsImporter";

export default class CurrentNewsRSSDataSource implements CurrentNewsDataSource {
    public parser = new Parser();

    public async get(feeds: NewsFeed[]): Promise<CurrentNews[]> {
        try {
            const news = (await Promise.all(feeds.map(feed => this.getNewsFromFeed(feed)))).flat();
            const lastMonthCurrentNews = news.filter((sn: any) =>
                this.isLastMonth(Date.parse(sn.summary.date))
            );

            return lastMonthCurrentNews;
        } catch (error) {
            console.log(`current news error: ${error}`);
            return [];
        }
    }

    public isLastMonth(newsDate: number): boolean {
        const diffTime = Math.abs(Date.now() - newsDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays < 30;
    }

    private async getNewsFromFeed(feed: NewsFeed): Promise<any[]> {
        //const categories = ["Actualités", "France Karaté", "Karaté"];

        let rss: any;
        try {
            rss = await this.parser.parseURL(feed.url.value);

            const items = rss?.items.filter(
                item =>
                    !feed.categories ||
                    feed.categories.length === 0 ||
                    (feed.categories.length > 0 &&
                        item.categories?.some(
                            cat => feed.categories && feed.categories.includes(cat)
                        ))
            );

            if (items) {
                return (
                    items?.filter(item => item.link).map((item: any) => this.mapItem(item, feed)) ??
                    []
                );
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
                image: feed.image?.value || "",
                url: feed.url.value,
            },
        };
    }
}
