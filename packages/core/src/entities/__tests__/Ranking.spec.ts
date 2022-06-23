import { Ranking, RankingData } from "../ranking/Ranking";

const rankingWithApiUrlRawData: RankingData = {
    id: "vnsabLUirBx",
    apiUrl: "http://setopen.sportdata.org/wkfranking/ranking_main_xml.php",
    categories: [
        "X4CZx1DLFPc",
        "TmnEeLzo5ZC",
        "Iw2DoanKm9v",
        "V83IThX1nUK",
        "UDzU7vR7f5d",
        "WLGaDXVqMMq",
        "hFYEGOPUado",
        "CGIStvIfXeW",
        "UahjbfogIwY",
        "LcjAUXFdx8g",
        "al3crY4XtHt",
        "We81KFRdTzD",
        "uAwCwvaoUgg",
        "wZgo8Vp77gR",
        "yWjCZGmwVa4",
        "qtYzfVYc50L",
        "vBqpirnDr9q",
        "XJewUnAs3h8",
        "Ww8ykIAZY3h",
        "ZAktwZxGwHY",
        "GQThKRR8qip",
        "A9kQFRo6Qr6",
        "vEDAwJF5RnZ",
        "kTmU4XUh7tV",
        "tSsHMvLTGnZ",
        "Mo8l32IRg22",
        "qTqhaOBk8dz",
        "R8TMhPcNykH",
        "Y7QgA6MG902",
        "N4yApST4WHK",
        "fS0NDfXes0t",
        "HvtxDhLD9mt",
        "iYGB5pBJkeq",
        "KqVrbhbJ72W",
        "kMe2wqSvf2O",
        "wa8Xgi22vUo",
        "Pw4ZqwmVlBy",
        "xVfJZTnAFUe",
        "pE9CTlKk3p0",
        "Xmnjvq0mdDI",
        "y8jGNlqeQsc",
        "mMpT1kz0VWi",
        "E03yVkTwIja",
        "KSFnGULfORI",
        "qhv3itgGF7J",
        "dRWUj3CsDTp",
        "Y2fr0IQfeuG",
        "dGYhLRiN6GO",
        "sQGQGEzSyyh",
        "b6rPfvAbXRM",
        "PxltLgEfzoU",
        "tG8K0y8p5Oo",
        "StEKlylVjwJ",
        "pqeURcUDAzj",
        "cjOJNYrbwwa",
        "iq8MIa2mIQ4",
        "SHFBkhRQpIV",
        "huMeQfwXAT4",
    ],
    categoryParameter: "ranking_category_id",
    name: "WKF Ranking",
    webUrl: null,
};

const rankingWithoutApiUrlRawData: RankingData = {
    id: "K6MwDuZ5r1X",
    apiUrl: null,
    categories: [],
    categoryParameter: null,
    name: "European Games 2023 Standings",
    webUrl: "http://setopen.sportdata.org/wkfranking/standing_egpoland2023.php",
};

describe("Ranking", () => {
    describe("create validations", () => {
        it("should not return errors if all fields are valid for ranking with api url", () => {
            const result = Ranking.create(rankingWithApiUrlRawData);

            result.fold(
                () => fail("should be success"),
                feed => expect(feed).toBeTruthy()
            );
        });
        it("should not return errors if all fields are valid for ranking without api url", () => {
            const result = Ranking.create(rankingWithoutApiUrlRawData);

            result.fold(
                () => fail("should be success"),
                feed => expect(feed).toBeTruthy()
            );
        });
        it("should return invalid field error for id", () => {
            const result = Ranking.create({ ...rankingWithApiUrlRawData, id: "wrong_id" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "id")?.errors[0]).toBe(
                        "invalid_field"
                    ),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for name", () => {
            const result = Ranking.create({ ...rankingWithApiUrlRawData, name: "" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "name")?.errors[0]).toBe(
                        "field_cannot_be_blank"
                    ),
                () => fail("should be error")
            );
        });
    });
});
