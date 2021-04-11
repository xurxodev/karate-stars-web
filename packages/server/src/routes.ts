import * as hapi from "@hapi/hapi";
import * as Path from "path";

import categoryRoutes from "./categories/api/CategoryRoutes";
import categoryTypeRoutes from "./category-types/api/CategoryTypeRoutes";
import competitorRoutes from "./competitors/api/CompetitorRoutes";
import countryRoutes from "./countries/api/CountryRoutes";
import currentNewsRoutes from "./currentnews/api/CurrentNewsRoutes";
import newsFeedsRoutes from "./newsfeeds/api/NewsFeedsRoutes";
import socialNewsRoutes from "./socialnews/api/SocialNewsRoutes";
import userRoutes from "./users/api/UserRoutes";
import videoRoutes from "./videos/api/VideoRoutes";
import eventTypeRoutes from "./event-types/api/EventTypeRoutes";
import eventRoutes from "./events/api/EventRoutes";

const initializeRoutes = (server: hapi.Server) => {
    const apiPrefix = "/api/v1";

    const allRoutes = [
        {
            method: "GET",
            path: "/",
            options: { auth: false as const },
            handler: (request: hapi.Request, h: hapi.ResponseToolkit) => {
                return h.redirect("/landing");
            },
        },
        {
            method: "GET",
            path: apiPrefix,
            options: { auth: false as const },
            handler: () => {
                return "Welcome to Karate Stars Api!!";
            },
        },
        {
            method: "GET",
            path: "/landing/{path*}",
            options: { auth: false as const },
            handler: {
                directory: {
                    path: Path.join(__dirname, "../../landing"),
                    listing: false,
                    index: true,
                },
            },
        },
        {
            method: "GET",
            path: "/admin/{path*}",
            options: { auth: false as const },
            handler: {
                directory: {
                    path: Path.join(__dirname, "../../admin/build"),
                    listing: false,
                    index: true,
                },
            },
        },
        ...categoryRoutes(apiPrefix),
        ...categoryTypeRoutes(apiPrefix),
        ...competitorRoutes(apiPrefix),
        ...countryRoutes(apiPrefix),
        ...eventRoutes(apiPrefix),
        ...eventTypeRoutes(apiPrefix),
        ...videoRoutes(apiPrefix),
        ...newsFeedsRoutes(apiPrefix),
        ...userRoutes(apiPrefix),
        ...socialNewsRoutes(apiPrefix),
        ...currentNewsRoutes(apiPrefix),
    ];

    allRoutes.forEach(route => {
        server.route(route);
    });
};

export default initializeRoutes;
