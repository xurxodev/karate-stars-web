import fetch from "node-fetch";
import Parser from "rss-parser";
import CurrentNewsRepository from "../../domain/currentnews/boundaries/CurrentNewsRepository";
import { CurrentNews, NewsSource } from "../../domain/currentnews/entities/CurrentNews";

export default class CurrentNewsRSSRepository implements CurrentNewsRepository {
    public parser = new Parser();

    public get(): Promise<CurrentNews[]> {
        return new Promise((resolve, reject) => {
            this.getCurrentNewsSources()
                .then((sources: any) => {
                    return Promise.all(sources.feeds.map(s => this.getNewsFromFeed(s)));
                })
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

    private async getCurrentNewsSources(): Promise<any[]> {
        const response = await fetch("http://www.karatestarsapp.com/api/v1/currentnewsconfig.json");

        return await response.json();
    }

    private async getNewsFromFeed(newsSource: NewsSource): Promise<any[]> {
        let rss: any;
        try {
            rss = await this.parser.parseURL(newsSource.url);

            if (rss && rss.items) {
                return rss?.items?.map((item: any) => this.mapItem(item, newsSource)) ?? [];
            } else {
                console.log(`There are not rss items to parse in ${newsSource.url}`);
                return [];
            }
        } catch (error) {
            console.log(`Error parsing url ${newsSource.url}`);
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

    private mapItem(item: any, newsSource: NewsSource): CurrentNews {
        const date = new Date(Date.parse(item.pubDate)).toISOString();

        const source = {
            name: newsSource.name,
            image: newsSource.image,
            url: newsSource.url,
        };

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
            source,
        };
    }
}
