import SocialNewsRepository from "../../domain/socialnews/boundaries/SocialNewsRepository";
import { SocialNews } from "../../domain/socialnews/entities/SocialNews";

// tslint:disable-next-line:max-line-length
export default class SocialNewsInmemoryRepository implements SocialNewsRepository {
    private socialNews: SocialNews[] = [
        {
            network: "twitter",
            summary: {
                image: "http://pbs.twimg.com/media/ELlHmtGW4AAg2rG.jpg",
                // tslint:disable-next-line:max-line-length
                video:
                    "https://video.twimg.com/ext_tw_video/1205829775127961600/pu/vid/720x720/8kqUrQJWotn6GHpP.mp4?tag=10",
                link: "https://twitter.com/karatestarsapp/status/1205829796669902849",
                date: "2019-12-14T11:33:13Z",
                title:
                    "#Karate1Madrid \uD83C\uDDEA\uD83C\uDDF8\nYassmin Attia action during Semi Final!\nDownload \n@KarateStarsApp\n and enjoy",
            },
            user: {
                image: "http://pbs.twimg.com/profile_images/902953212696768523/wMWePMB9_normal.jpg",
                name: "karate Stars",
                url: "https://t.co/Cfw7njKIJu",
                userName: "karatestarsapp",
            },
        },
        {
            network: "twitter",
            summary: {
                image: "http://pbs.twimg.com/media/ELlHmtGW4AAg2rG.jpg",
                video: undefined,
                link: "https://twitter.com/RFEKarate/status/1205073112863248384",
                date: "2019-12-12T11:33:13Z",
                title: "https://t.co/lgFyxqVM4Z",
            },
            user: {
                image:
                    "http://pbs.twimg.com/profile_images/1172254692354736128/qBaULh-K_normal.jpg",
                name: "R.F.Española Karate",
                url: "https://t.co/fNMtlDqc0Q",
                userName: "RFEKarate",
            },
        },
        {
            network: "twitter",
            summary: {
                image: "http://pbs.twimg.com/media/ELk_vAxVUAA9JMS.jpg",
                video: undefined,
                link: "https://twitter.com/ayayumin/status/1205064460701814785",
                date: "2019-12-12T10:18:51Z",
                title: "https://t.co/XJT3RlenLm",
            },
            user: {
                image:
                    "http://pbs.twimg.com/profile_images/1100944272348471296/HGG-yv5P_normal.jpg",
                name: "植草歩",
                url: "https://t.co/cfY0bCNELV",
                userName: "ayayumin",
            },
        },
        {
            network: "twitter",
            summary: {
                image:
                    "http://pbs.twimg.com/ext_tw_video_thumb/1205042655983480832/pu/img/qjNBCVoq9RU8hWra.jpg",
                // tslint:disable-next-line:max-line-length
                video:
                    "https://video.twimg.com/ext_tw_video/1205042655983480832/pu/vid/720x720/cnx3tHoaeKFLMSGd.mp4?tag=10",
                link: "https://twitter.com/karatestarsapp/status/1205042676661391360",
                date: "2019-12-12T09:32:17Z",
                title:
                    "#Karate1Madrid 🇪🇸\nAmir Mehdizadeh action during the round 4\nDownload @KarateStarsApp and enjoy https://t.co/qDajinY1KH",
            },
            user: {
                image: "http://pbs.twimg.com/profile_images/902953212696768523/wMWePMB9_normal.jpg",
                name: "karate Stars",
                url: "https://t.co/Cfw7njKIJu",
                userName: "karatestarsapp",
            },
        },
        {
            network: "twitter",
            summary: {
                image: "http://pbs.twimg.com/media/ELko1joWkAAMO3P.jpg",
                video: undefined,
                link: "https://twitter.com/sandrasankarate/status/1205039307406368768",
                date: "2019-12-11T09:18:54Z",
                title:
                    "Something good is coming!!\nIt\u0027s always an honor to share tatami with you @RikaUsami\nAnd after training it\u0027s time to enjoy 😜☺️\n\n#Karate #Friends #Nice #Moments #Training #Enjoy #Smile  #RikaUsami #SandraSanKarate https://t.co/k63lrCQQKe",
            },
            user: {
                image: "http://pbs.twimg.com/profile_images/734425883428179969/DCg_4GAu_normal.jpg",
                name: "Sandra Sánchez",
                url: "https://t.co/vlnexRMzsa",
                userName: "sandrasankarate",
            },
        },
        {
            network: "twitter",
            summary: {
                image:
                    "http://pbs.twimg.com/ext_tw_video_thumb/1204995934351872001/pu/img/JXaMsdjbZvA3qToP.jpg",
                video: undefined,
                link: "https://twitter.com/ayayumin/status/1204995965049962496",
                date: "2019-12-11T06:26:40Z",
                title:
                    "ラグビーワールドカップ2019🏉\n日本大会記念シンポジウム🇯🇵\n＃RWC2019 ＃東京2020\n#読売新聞 https://t.co/zv91KKPx0L",
            },
            user: {
                image:
                    "http://pbs.twimg.com/profile_images/1100944272348471296/HGG-yv5P_normal.jpg",
                name: "植草歩",
                url: "https://t.co/cfY0bCNELV",
                userName: "ayayumin",
            },
        },
        {
            network: "twitter",
            summary: {
                image: "http://pbs.twimg.com/media/ELg-0UqXsAE1G8_.jpg",
                video: undefined,
                link: "https://twitter.com/ffkarate/status/1204781974717681671",
                date: "2019-12-11T16:16:21Z",
                title:
                    "#ParisKarate2020 #Tokyo2020 🥋\n\n📺 C\u0027est désormais officiel, les finales du Tournoi de Qualification Olympique de #Karaté seront diffusées par le groupe @Francetele, via la chaîne @FranceOtv.  \nRendez-vous les 8, 9 et 10 mai prochain ! 👊 https://t.co/wsrlf0cywA",
            },
            user: {
                image: "http://pbs.twimg.com/profile_images/963780623293874176/6YxTNIP5_normal.jpg",
                name: "FFKarate",
                url: "https://t.co/R7aHIAkKFx",
                userName: "ffkarate",
            },
        },
        {
            network: "twitter",
            summary: {
                image: "http://pbs.twimg.com/media/ELf-2V_WsAEL78W.jpg",
                video: undefined,
                link: "https://twitter.com/ffkarate/status/1204711653205520384",
                date: "2019-12-11T11:36:55Z",
                title:
                    "Voici les belles photos de la Coupe de France Combats Juniors de #karaté, qui s\u0027est déroulée à Orléans. De beaux moments de partage et de fraternité vécus à travers les émotions des combattants. 👏🥋\n\n+ de photos : https://t.co/W2qB23hhFI\n\n📸 Aurélien Morissard - FFK https://t.co/iC8yc3lrdX",
            },
            user: {
                image: "http://pbs.twimg.com/profile_images/963780623293874176/6YxTNIP5_normal.jpg",
                name: "FFKarate",
                url: "https://t.co/R7aHIAkKFx",
                userName: "ffkarate",
            },
        },
        {
            network: "twitter",
            summary: {
                image:
                    "http://pbs.twimg.com/ext_tw_video_thumb/1204652232433709056/pu/img/4qlYQw9tRb6AWhB3.jpg",
                video: undefined,
                link: "https://twitter.com/karatestarsapp/status/1204652310326136832",
                date: "2019-12-11T07:41:06Z",
                title:
                    "#Karate1Madrid 🇪🇸\nWazari for Amir Mehdizadeh against Steven Da Costa \nDownload @KarateStarsApp and enjoy https://t.co/YLfEyBybPW",
            },
            user: {
                image: "http://pbs.twimg.com/profile_images/902953212696768523/wMWePMB9_normal.jpg",
                name: "karate Stars",
                url: "https://t.co/Cfw7njKIJu",
                userName: "karatestarsapp",
            },
        },
        {
            network: "twitter",
            summary: {
                image: "http://pbs.twimg.com/media/ELevh-hU8AAnu5L.jpg",
                video: undefined,
                link: "https://twitter.com/ayayumin/status/1204624433471582214",
                date: "2019-12-11T05:50:20Z",
                title:
                    "スポーツ×ヒューマン(アンコール放送)\n「あの日の涙を笑顔に変える ～空手 植草 歩～」\n\nNHK BSプレミアム\n2019年12月14日(土) 12:00～12:44\n\nNHK総合\n2019年12月17日(火) 02:00～02:44 https://t.co/VNJihdbxbl",
            },
            user: {
                image:
                    "http://pbs.twimg.com/profile_images/1100944272348471296/HGG-yv5P_normal.jpg",
                name: "植草歩",
                url: "https://t.co/cfY0bCNELV",
                userName: "ayayumin",
            },
        },
        {
            network: "twitter",
            summary: {
                image:
                    "http://pbs.twimg.com/ext_tw_video_thumb/1204624158082002944/pu/img/Aeo9cDLPIaY9cl0b.jpg",
                video: undefined,
                link: "https://twitter.com/worldkarate_wkf/status/1204624291322462208",
                date: "2019-12-11T05:49:46Z",
                title:
                    "Karate will be in the Youth Olympic Games Dakar 2022❗️\nAnna Chernysheva 🇷🇺 who won silver at the Youth Olympic Games Buenos Aires 2018 tell us what it means to be an Olympic Karate athlete 👇\n#Karate 🥋 #RoadtoDakar2022 https://t.co/JrAo4lnaxM",
            },
            user: {
                image:
                    "http://pbs.twimg.com/profile_images/1201777744679440384/WgZLeida_normal.jpg",
                name: "World Karate Federation 🥋",
                url: "https://t.co/gi0CtXBjdr",
                userName: "worldkarate_wkf",
            },
        },
        {
            network: "twitter",
            summary: {
                image: "http://pbs.twimg.com/media/ELeE4xJUYAAnh2Z.jpg",
                video: undefined,
                link: "https://twitter.com/ayayumin/status/1204577547469508613",
                date: "2019-12-11T02:44:01Z",
                title:
                    "みんな応援に来てくれてありがとう👯‍♀️💓🌈\n写真撮れなくて、会えなかった人達も\n応援に来てくれてありがとうございました🙏🏻\n応援が力になりました📣✩.*˚ https://t.co/Q1mJQeWhFZ",
            },
            user: {
                image:
                    "http://pbs.twimg.com/profile_images/1100944272348471296/HGG-yv5P_normal.jpg",
                name: "植草歩",
                url: "https://t.co/cfY0bCNELV",
                userName: "ayayumin",
            },
        },
        {
            network: "twitter",
            summary: {
                image: undefined,
                video: undefined,
                link: "https://twitter.com/diazkarate/status/1204509791902666752",
                date: "2019-12-10T22:14:47Z",
                title:
                    "A un mes de la realización de la Karate 1 Series A - Santiago 2020, los atletas venezolanos no tenemos aún respuesta sobre la visa para asistir @cgchilecaracas @echilevenezuela",
            },
            user: {
                image:
                    "http://pbs.twimg.com/profile_images/478758361828429824/9_Gpjqjh_normal.jpeg",
                name: "Antonio Díaz",
                url: "https://t.co/VLWMoreICb",
                userName: "diazkarate",
            },
        },
        {
            network: "twitter",
            summary: {
                image: "http://pbs.twimg.com/media/ELcX8BNW4AINBln.jpg",
                video: undefined,
                link: "https://twitter.com/DamianHQuintero/status/1204457753143627782",
                date: "2019-12-10T18:48:00Z",
                title:
                    "Some push-ups to start the #training session? And don’t forget to clap your hands! 👏\n\n#Karate #KINGtero #Clapping https://t.co/ZcKR8VIFHv",
            },
            user: {
                image:
                    "http://pbs.twimg.com/profile_images/1055513556689584128/eUDnql6u_normal.jpg",
                name: "Damian Quintero",
                url: "https://t.co/HTjpxtJED3",
                userName: "DamianHQuintero",
            },
        },
        {
            network: "twitter",
            summary: {
                image: undefined,
                video: undefined,
                link: "https://twitter.com/ffkarate/status/1204426532535582720",
                date: "2019-12-10T16:43:57Z",
                title:
                    "#PortraitFFK 🥋🎙\n\nVous avez peut-être déjà pris part à un stage en sa présence, voici le portrait de Masao Kagawa, une légende de la JKA et considéré aujourd\u0027hui comme l\u0027un des instructeurs les plus brillants de #karaté. 👊",
            },
            user: {
                image: "http://pbs.twimg.com/profile_images/963780623293874176/6YxTNIP5_normal.jpg",
                name: "FFKarate",
                url: "https://t.co/R7aHIAkKFx",
                userName: "ffkarate",
            },
        },
        {
            network: "twitter",
            summary: {
                image: undefined,
                video: undefined,
                link: "https://twitter.com/RFEKarate/status/1204407935272546304",
                date: "2019-12-10T15:30:03Z",
                title:
                    "El kárate internacional se da cita en Pinto | Este de Madrid https://t.co/hd9Q85cQ0k",
            },
            user: {
                image:
                    "http://pbs.twimg.com/profile_images/1172254692354736128/qBaULh-K_normal.jpg",
                name: "R.F.Española Karate",
                url: "https://t.co/fNMtlDqc0Q",
                userName: "RFEKarate",
            },
        },
        {
            network: "twitter",
            summary: {
                image: undefined,
                video: undefined,
                link: "https://twitter.com/RFEKarate/status/1204407358647984128",
                date: "2019-12-10T15:27:45Z",
                title:
                    "Rompiendo barreras: Fran Lozano, pionero en el deporte para ciegos https://t.co/3pRxlv9zSX vía @TribunaOlimpica",
            },
            user: {
                image:
                    "http://pbs.twimg.com/profile_images/1172254692354736128/qBaULh-K_normal.jpg",
                name: "R.F.Española Karate",
                url: "https://t.co/fNMtlDqc0Q",
                userName: "RFEKarate",
            },
        },
        {
            network: "twitter",
            summary: {
                image: "http://pbs.twimg.com/media/ELbHcgOXsAAt6Xn.jpg",
                video: undefined,
                link: "https://twitter.com/Karateturk/status/1204369252058357761",
                date: "2019-12-10T12:56:20Z",
                title:
                    "Shotokan karatenin yaşayan en büyük isimlerinden olan Hirokazu Kanazawa 88 yaşında hayatını kaybetti.\n\n10. Dan sahibi Shihan Kanazawa, bir dönem Türkiye\u0027ye de gelerek Federasyon Başkanımız Esat Delihasan\u0027ın ev sahipliğinde Ankara ve İstanbul\u0027da seminerler düzenlemişti. https://t.co/sx6pCSorkI",
            },
            user: {
                image: "http://pbs.twimg.com/profile_images/955352682214121474/i374yuD6_normal.jpg",
                name: "Karate Federasyonu (TKF)",
                url: "https://t.co/yibtbRlmxx",
                userName: "Karateturk",
            },
        },
        {
            network: "twitter",
            summary: {
                image: undefined,
                video: undefined,
                link: "https://twitter.com/worldkarate_wkf/status/1204315435899863045",
                date: "2019-12-10T09:22:29Z",
                title:
                    "Best KARATE moments of final day of Karate 1-Premier League Madrid https://t.co/SaBFfiFDUL",
            },
            user: {
                image:
                    "http://pbs.twimg.com/profile_images/1201777744679440384/WgZLeida_normal.jpg",
                name: "World Karate Federation 🥋",
                url: "https://t.co/gi0CtXBjdr",
                userName: "worldkarate_wkf",
            },
        },
        {
            network: "twitter",
            summary: {
                image: "http://pbs.twimg.com/media/ELaF8ytVAAAHS-H.jpg",
                video: undefined,
                link: "https://twitter.com/ayayumin/status/1204297249225723905",
                date: "2019-12-10T08:10:13Z",
                title:
                    "JAPANteam🇯🇵のオフシャルスポンサーをして下さっている企業様へ、2019年の全ての試合を終えご報告も兼ねて挨拶に5人で行ってきました🙏🏻🌈💓\n今年1年間サポートありがとうございました🌼*･\n#JAL\n#日本生命\n#kikkoman \n#ajinomoto \n#lululun \n#毎日新聞\n#読売新聞\n#乃村工藝社\n#DESCENTE https://t.co/j1JDNbFZD4",
            },
            user: {
                image:
                    "http://pbs.twimg.com/profile_images/1100944272348471296/HGG-yv5P_normal.jpg",
                name: "植草歩",
                url: "https://t.co/cfY0bCNELV",
                userName: "ayayumin",
            },
        },
        {
            network: "twitter",
            summary: {
                image: undefined,
                video: undefined,
                link: "https://twitter.com/RFEKarate/status/1204293822353694720",
                date: "2019-12-10T07:56:36Z",
                title: "https://t.co/u8o3Lr8a2U vía @Actualidad Valdepeñas",
            },
            user: {
                image:
                    "http://pbs.twimg.com/profile_images/1172254692354736128/qBaULh-K_normal.jpg",
                name: "R.F.Española Karate",
                url: "https://t.co/fNMtlDqc0Q",
                userName: "RFEKarate",
            },
        },
        {
            network: "twitter",
            summary: {
                image:
                    "http://pbs.twimg.com/ext_tw_video_thumb/1204278713980006400/pu/img/n6s2Cgke22CdBjoG.jpg",
                video: undefined,
                link: "https://twitter.com/karatestarsapp/status/1204278731122135040",
                date: "2019-12-10T06:56:38Z",
                title:
                    "#Karate1Madrid 🇪🇸\nYuko for Steven Da Costa in her first match!\nDownload @KarateStarsApp and enjoy https://t.co/SXPeYrUKCe",
            },
            user: {
                image: "http://pbs.twimg.com/profile_images/902953212696768523/wMWePMB9_normal.jpg",
                name: "karate Stars",
                url: "https://t.co/Cfw7njKIJu",
                userName: "karatestarsapp",
            },
        },
        {
            network: "twitter",
            summary: {
                image: "http://pbs.twimg.com/media/ELZDjBLU0AMYYCH.jpg",
                video: undefined,
                link: "https://twitter.com/worldkarate_wkf/status/1204224224811839488",
                date: "2019-12-10T03:20:03Z",
                title:
                    "Malaysia top Karate competition at SEA Games 2019\nhttps://t.co/72L4rmQcay\n#Karate 🥋 https://t.co/OVnNKdcWt6",
            },
            user: {
                image:
                    "http://pbs.twimg.com/profile_images/1201777744679440384/WgZLeida_normal.jpg",
                name: "World Karate Federation 🥋",
                url: "https://t.co/gi0CtXBjdr",
                userName: "worldkarate_wkf",
            },
        },
        {
            network: "twitter",
            summary: {
                image: undefined,
                video: undefined,
                link: "https://twitter.com/DouglasBrose/status/1204072053319569409",
                date: "2019-12-09T17:15:22Z",
                title:
                    "O exemplo arrasta! Oss\n\n______________________________________________\n#TimeAjinomoto #FloripaTeam #BroseTeam #Tokyo2020 #TeamArawaza #Olympic #douglasbrose #worldchampion #karate #wkf #kumite #worldkaratechampion… https://t.co/BTeCQsZbIK",
            },
            user: {
                image: "http://pbs.twimg.com/profile_images/916726819394674688/aohRwHib_normal.jpg",
                name: "Douglas Brose",
                url: "https://t.co/FWe6IR6bRG",
                userName: "DouglasBrose",
            },
        },
        {
            network: "twitter",
            summary: {
                image: "http://pbs.twimg.com/media/ELWNLURXUAE4DIj.jpg",
                video: undefined,
                link: "https://twitter.com/Karateturk/status/1204023712749670400",
                date: "2019-12-09T14:03:17Z",
                title:
                    "Milli karatecilerimiz @ArapogluSerap ve @uguraktas84, Karate 1 Premier Lig\u0027de elde ettikleri başarılar ile sıkletlerinde sezonun en iyisi olarak 2019\u0027u noktaladı. \n#GrandWinner\n#Karateturk https://t.co/7e8Ci3memG",
            },
            user: {
                image: "http://pbs.twimg.com/profile_images/955352682214121474/i374yuD6_normal.jpg",
                name: "Karate Federasyonu (TKF)",
                url: "https://t.co/yibtbRlmxx",
                userName: "Karateturk",
            },
        },
        {
            network: "twitter",
            summary: {
                image: "http://pbs.twimg.com/media/ELVtA1QUEAEZg7t.jpg",
                video: undefined,
                link: "https://twitter.com/ayayumin/status/1203988360915648512",
                date: "2019-12-09T11:42:48Z",
                title:
                    "私は香川師範のもとで\n空手をしてきたから強くなれました。\n師範からの「疲れただろう」\nその一言だけでいろんなものや\n私の肩の荷がおりました。\n宏人、初優勝おめでとう🥳🏆🎉\n次は一緒に師範に金メダルを🥇🥇🥇\n#帝京大学 \n#teamadidas #adidas https://t.co/bIJjNAWtoF",
            },
            user: {
                image:
                    "http://pbs.twimg.com/profile_images/1100944272348471296/HGG-yv5P_normal.jpg",
                name: "植草歩",
                url: "https://t.co/cfY0bCNELV",
                userName: "ayayumin",
            },
        },
        {
            network: "twitter",
            summary: {
                image: "http://pbs.twimg.com/media/ELVqw8WX0AEfwuw.jpg",
                video: undefined,
                link: "https://twitter.com/sandrasankarate/status/1203985873517367296",
                date: "2019-12-09T11:22:28Z",
                title:
                    "Lunes de una semana intensa!! 🥋🌟\n\nY a ti, qué te hace sonreír?? ☺️\nWhat makes you smile ??  ☺️\n\n📸 @kiamotorsiberia\n\n#Karate #SandraSanKarate https://t.co/q5wNljFtxW",
            },
            user: {
                image: "http://pbs.twimg.com/profile_images/734425883428179969/DCg_4GAu_normal.jpg",
                name: "Sandra Sánchez",
                url: "https://t.co/vlnexRMzsa",
                userName: "sandrasankarate",
            },
        },
        {
            network: "twitter",
            summary: {
                image: undefined,
                video: undefined,
                link: "https://twitter.com/RFEKarate/status/1203955633206300672",
                date: "2019-12-09T09:32:46Z",
                title:
                    "Éxito de participación y público en la gran final de la Liga Nacional de Karate en Valdepeñas https://t.co/UlNcvhh2ry vía @@valderec.es",
            },
            user: {
                image:
                    "http://pbs.twimg.com/profile_images/1172254692354736128/qBaULh-K_normal.jpg",
                name: "R.F.Española Karate",
                url: "https://t.co/fNMtlDqc0Q",
                userName: "RFEKarate",
            },
        },
        {
            network: "twitter",
            summary: {
                image: undefined,
                video: undefined,
                link: "https://twitter.com/RFEKarate/status/1203955351139311617",
                date: "2019-12-09T09:31:38Z",
                title:
                    "Éxito de participación y público en la gran final de la Liga Nacional en Valdepeñas - Lanza Digital https://t.co/hNlgdMI6PT",
            },
            user: {
                image:
                    "http://pbs.twimg.com/profile_images/1172254692354736128/qBaULh-K_normal.jpg",
                name: "R.F.Española Karate",
                url: "https://t.co/fNMtlDqc0Q",
                userName: "RFEKarate",
            },
        },
    ];

    public get(): Promise<SocialNews[]> {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(this.socialNews);
            }, 250);
        });
    }
}
