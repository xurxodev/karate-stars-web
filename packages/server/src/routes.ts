import * as hapi from "@hapi/hapi";
import * as Path from "path";

import categoryRoutes from "./api/categories/CategoryRoutes";
import competitorRoutes from "./api/competitors/CompetitorRoutes";
import countryRoutes from "./api/countries/CountryRoutes";
import currentNewsRoutes from "./api/currentnews/CurrentNewsRoutes";
import socialNewsRoutes from "./api/socialnews/SocialNewsRoutes";
import userRoutes from "./api/users/UserRoutes";
import videoRoutes from "./api/videos/VideoRoutes";

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
            path: "/api",
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
        ...userRoutes(apiPrefix),
        ...socialNewsRoutes(apiPrefix),
        ...currentNewsRoutes(apiPrefix),
        ...competitorRoutes(apiPrefix),
        ...countryRoutes(apiPrefix),
        ...categoryRoutes(apiPrefix),
        ...videoRoutes(apiPrefix),
    ];

    allRoutes.forEach(route => {
        server.route(route);
    });
};

export default initializeRoutes;
