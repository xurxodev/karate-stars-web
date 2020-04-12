import * as hapi from "hapi";
import currentNewsRoutes from "./api/currentnews/CurrentNewsRoutes";
import socialNewsRoutes from "./api/socialnews/SocialNewsRoutes";
import userRoutes from "./api/users/UserRoutes";
import competitorRoutes from "./api/competitors/CompetitorRoutes";

const initializeRoutes = (server: hapi.Server) => {
    const allRoutes = [{
        method: "GET",
        path: "/",
        options: { auth: false },
        handler: async () => {
            return "Welcome to Karate Stars API!!";
        }
    }, ...userRoutes(), ...socialNewsRoutes(), ...currentNewsRoutes(), ...competitorRoutes()];

    allRoutes.forEach((route: hapi.ServerRoute) => {
        server.route(route);
    });
};

export default initializeRoutes;
