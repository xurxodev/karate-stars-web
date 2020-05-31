import CurrentNewsRepository from "../../domain/currentnews/boundaries/CurrentNewsRepository";
import { CurrentNews } from "../../domain/currentnews/entities/CurrentNews";

// tslint:disable-next-line:max-line-length
export default class CurrentNewsInMemoryRepository implements CurrentNewsRepository {
    private currentNews: CurrentNews[] = [
        {
            source: {
                image: "http://www.karatestarsapp.com/app/logos/karate_k.png",
                name: "karate-k",
                url: "http://karate-k.com/en/?format\u003dfeed\u0026type\u003drss",
            },
            summary: {
                image: "https://www.karate-k.com/images/Kanazawa/Kanazawa_2.jpg",
                link:
                    "https://karate-k.com/en/karate-do/shotokan/news/583-hirokazu-kanazawa-went-away.html",
                date: "2019-12-09T16:30:31Z",
                title: "Hirokazu Kanazawa passed away",
            },
        },
        {
            source: {
                image: "http://www.karatestarsapp.com/app/logos/wkf.png",
                name: "WKF News Center",
                url: "http://fetchrss.com/rss/59baa0d28a93f8a1048b4567777611407.xml",
            },
            summary: {
                image:
                    "https://wkf.net/imagenes/noticias/malaysia-top-karate-competition-at-sea-games-2019-42.jpg",
                link:
                    "https://wkf.net/news-center-new/malaysia-top-karate-competition-at-sea-games-2019/1124/",
                date: "2019-12-09T01:00:00Z",
                title: "Malaysia top Karate competition at SEA Games 2019",
            },
        },
        {
            source: {
                image: "http://www.karatestarsapp.com/app/logos/wkf.png",
                name: "WKF News Center",
                url: "http://fetchrss.com/rss/59baa0d28a93f8a1048b4567777611407.xml",
            },
            summary: {
                image:
                    "https://wkf.net/imagenes/noticias/karate-powerhouses-take-stand-at-sea-games-609.jpg",
                link:
                    "https://wkf.net/news-center-new/karate-powerhouses-take-stand-at-sea-games/1123/",
                date: "2019-12-08T01:00:00Z",
                title: "Karate powerhouses take a stand at SEA Games",
            },
        },
        {
            source: {
                image: "http://www.karatestarsapp.com/app/logos/karate_k.png",
                name: "karate-k",
                url: "http://karate-k.com/en/?format\u003dfeed\u0026type\u003drss",
            },
            summary: {
                image: "https://www.karate-k.com/images/Japon/Uekusa-Paris2019F-164.jpg",
                link:
                    "https://karate-k.com/en/sport/news/581-grand-winner-2019-all-the-best-s.html",
                date: "2019-12-05T14:25:05Z",
                title: "Grand winner 2019 / All the best(s)",
            },
        },
        {
            source: {
                image: "http://www.karatestarsapp.com/app/logos/inside_the_games.gif",
                name: "Inside The Games",
                url: "http://fetchrss.com/rss/59baa0d28a93f8a1048b4567627850382.xml",
            },
            summary: {
                image:
                    "https://www.insidethegames.biz/media/image/164003/o/karate-included-in-sports-programme-of-youth-olympic-games-dakar-2022-783.jpg",
                link:
                    "https://www.insidethegames.biz/articles/1087831/karate-welcome-dakar-2022-inclusion",
                date: "2019-12-05T14:24:32Z",
                title:
                    "WKF President claims karate will show why it deserves core Olympic place at Dakar 2022",
            },
        },
        {
            source: {
                image: "http://www.karatestarsapp.com/app/logos/karate_k.png",
                name: "karate-k",
                url: "http://karate-k.com/en/?format\u003dfeed\u0026type\u003drss",
            },
            summary: {
                image: "https://www.karate-k.com/images/Turquie/Aktas-Madrid19F-120.jpg",
                link:
                    "https://karate-k.com/en/sport/news/578-tokyo-2020-assadilov-and-aktas-smell-tokyo.html",
                date: "2019-12-04T17:16:03Z",
                title: "Tokyo 2020 / Assadilov and Aktas smell Tokyo",
            },
        },
        {
            source: {
                image: "http://www.karatestarsapp.com/app/logos/wkf.png",
                name: "WKF News Center",
                url: "http://fetchrss.com/rss/59baa0d28a93f8a1048b4567777611407.xml",
            },
            summary: {
                image:
                    "https://wkf.net/imagenes/noticias/karate-included-in-sports-programme-of-youth-olympic-games-dakar-2022-783.jpg",
                link:
                    "https://wkf.net/news-center-new/karate-included-in-sports-programme-of-youth-olympic-games-dakar-2022/1120/",
                date: "2019-12-04T01:00:00Z",
                title: "Karate included in sports programme of Youth Olympic Games Dakar 2022",
            },
        },
        {
            source: {
                image: "http://www.karatestarsapp.com/app/logos/wkf.png",
                name: "WKF News Center",
                url: "http://fetchrss.com/rss/59baa0d28a93f8a1048b4567777611407.xml",
            },
            summary: {
                image:
                    "https://wkf.net/imagenes/noticias/thrilling-2020-season-to-start-with-anticipated-karate-1-series-a-santiago-845.jpg",
                link:
                    "https://wkf.net/news-center-new/thrilling-2020-season-to-start-with-anticipated-karate-1-series-a-santiago/1121/",
                date: "2019-12-04T01:00:00Z",
                title: "Thrilling 2020 season to start with anticipated Karate 1-Series A Santiago",
            },
        },
        {
            source: {
                image: "http://www.karatestarsapp.com/app/logos/wkf.png",
                name: "WKF News Center",
                url: "http://fetchrss.com/rss/59baa0d28a93f8a1048b4567777611407.xml",
            },
            summary: {
                image:
                    "https://wkf.net/imagenes/noticias/karate-set-to-highlight-2019-sea-games-227.jpg",
                link:
                    "https://wkf.net/news-center-new/karate-set-to-make-impact-at-2019-sea-games/1122/",
                date: "2019-12-03T01:00:00Z",
                title: "Karate set to make impact at 2019 SEA Games",
            },
        },
        {
            source: {
                image: "http://www.karatestarsapp.com/app/logos/oa_sport.png",
                name: "Karate – OA Sport",
                url: "http://fetchrss.com/rss/59baa0d28a93f8a1048b4567506228339.xml",
            },
            summary: {
                image:
                    "https://www.oasport.it/wp-content/uploads/bfi_thumb/11111797_10206858139109148_413755820391470997_n-nhzlx2ydbd98qs6shiwx9pfwdyq80p78o7xl3n0upa.jpg",
                link:
                    "https://www.oasport.it/2019/12/karate-premier-league-madrid-2019-argento-per-silvia-semeraro-nei-68kg-e-per-la-squadra-di-kata-luigi-busa-bronzo-nei-75kg/",
                date: "2019-12-02T07:45:00Z",
                title:
                    "Karate, Premier League Madrid 2019: argento per Silvia Semeraro nei -68kg e per la squadra di kata, Luigi Busà bronzo nei -75kg",
            },
        },
        {
            source: {
                image: "http://www.karatestarsapp.com/app/logos/karate_k.png",
                name: "karate-k",
                url: "http://karate-k.com/en/?format\u003dfeed\u0026type\u003drss",
            },
            summary: {
                image: "https://www.karate-k.com/images/Iran/Ganjzadeh-Dubai2017.jpg",
                link:
                    "https://karate-k.com/en/sport/news/577-karate-1-madrid-assadilov-5th-win-out-of-7-k1.html",
                date: "2019-12-01T17:10:34Z",
                title: "Karate 1 Madrid / Assadilov 5th win out of 7 K1",
            },
        },
        {
            source: {
                image: "http://www.karatestarsapp.com/app/logos/oa_sport.png",
                name: "Karate – OA Sport",
                url: "http://fetchrss.com/rss/59baa0d28a93f8a1048b4567506228339.xml",
            },
            summary: {
                image:
                    "https://www.oasport.it/wp-content/uploads/bfi_thumb/silvia-semeraro-pagina-facebook-e1553938267163-o5mmg6ornyvy20gpx5aadf6wmwke4upmf598i1szum.jpg",
                link:
                    "https://www.oasport.it/2019/11/karate-premier-league-madrid-2019-una-grandiosa-silvia-semeraro-conquista-la-finale-clio-ferracuti-in-corsa-per-il-terzo-posto-2/",
                date: "2019-12-01T07:45:34Z",
                title:
                    "Karate, Premier League Madrid 2019: una grandiosa Silvia Semeraro conquista la finale, Clio Ferracuti in corsa per il terzo posto",
            },
        },
        {
            source: {
                image: "http://www.karatestarsapp.com/app/logos/karate_k.png",
                name: "karate-k",
                url: "http://karate-k.com/en/?format\u003dfeed\u0026type\u003drss",
            },
            summary: {
                image: "https://www.karate-k.com/images/Turquie/Aktas-Guada19F-063.jpg",
                link:
                    "https://karate-k.com/en/sport/news/575-karate1madrid-aktas-zaretska-and-chatziliadou-are-in-final.html",
                date: "2019-11-30T20:20:06Z",
                title: "Karate1Madrid / Aktas, Zaretska and Chatziliadou are in final",
            },
        },
        {
            source: {
                image: "http://www.karatestarsapp.com/app/logos/oa_sport.png",
                name: "Karate – OA Sport",
                url: "http://fetchrss.com/rss/59baa0d28a93f8a1048b4567506228339.xml",
            },
            summary: {
                image:
                    "https://www.oasport.it/wp-content/uploads/bfi_thumb/Riepilogo-karate-ohg5g2i7aoqyydcqdl880vurugp5boi42xu8ot5jn2.jpg",
                link:
                    "https://www.oasport.it/2019/11/karate-premier-league-madrid-2019-italia-strepitosa-nel-kata-a-squadre-maschile-viviana-bottaro-e-luigi-busa-in-finale-per-il-terzo-posto-2/",
                date: "2019-11-30T19:27:25Z",
                title:
                    "Karate, Premier League Madrid 2019: Italia strepitosa nel kata a squadre maschile, Viviana Bottaro e Luigi Busà in finale per il terzo posto",
            },
        },
        {
            source: {
                image: "http://www.karatestarsapp.com/app/logos/oa_sport.png",
                name: "Karate – OA Sport",
                url: "http://fetchrss.com/rss/59baa0d28a93f8a1048b4567506228339.xml",
            },
            summary: {
                image:
                    "https://www.oasport.it/wp-content/uploads/bfi_thumb/LP_8785338-o8vo2930rr5i6q6gh0gdpymufbjayzrej9mcf1fjou.jpg",
                link:
                    "https://www.oasport.it/2019/11/karate-premier-league-madrid-2019-si-chiude-la-stagione-con-ben-49-azzurri-impegnati-2/",
                date: "2019-11-30T07:27:25Z",
                title:
                    "Karate, Premier League Madrid 2019: si chiude la stagione con ben 49 azzurri impegnati",
            },
        },
        {
            source: {
                image: "http://www.karatestarsapp.com/app/logos/karate_k.png",
                name: "karate-k",
                url: "http://karate-k.com/en/?format\u003dfeed\u0026type\u003drss",
            },
            summary: {
                image: "https://www.karate-k.com/images/Iran/Istanbul2018F-052.jpg",
                link:
                    "https://karate-k.com/en/sport/news/573-karate-1-madrid-mehdizadeh-man-of-the-day.html",
                date: "2019-11-29T20:37:48Z",
                title: "Karate 1 Madrid / Mehdizadeh, man of the day",
            },
        },
        {
            source: {
                image: "http://www.karatestarsapp.com/app/logos/oa_sport.png",
                name: "Karate – OA Sport",
                url: "http://fetchrss.com/rss/59baa0d28a93f8a1048b4567506228339.xml",
            },
            summary: {
                image:
                    "https://www.oasport.it/wp-content/uploads/bfi_thumb/Luigi-Busà-comunicato-Fijlkam-karate-nyv4l0ke55qukl71wrt1tpgzh2p2b51hevfgmybp7y.jpg",
                link:
                    "https://www.oasport.it/2019/11/karate-premier-league-madrid-2019-programma-orari-e-tv/",
                date: "2019-11-27T04:27:29Z",
                title: "Karate, Premier League Madrid 2019: programma, orari e tv",
            },
        },
    ];

    public get(): Promise<CurrentNews[]> {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(this.currentNews);
            }, 250);
        });
    }
}
