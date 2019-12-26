import * as hapi from "hapi";
import currentNewsRoutes from "./api/currentnews/CurrentNewsRoutes";
import socialNewsRoutes from "./api/socialnews/SocialNewsRoutes";
import jwtAuthentication from "./api/users/JwtAuthentication";
import userRoutes from "./api/users/UserRoutes";

const server: hapi.Server = new hapi.Server({
  host: "0.0.0.0",
  port: process.env.PORT || 8000
});

async function start() {
  try {
    await server.register(require("hapi-auth-jwt2"));
    const validate = jwtAuthentication.validateHandler;
    const secretKey = jwtAuthentication.secretKey;

    server.auth.strategy(jwtAuthentication.name, "jwt", {
      key: secretKey,
      validate
    });

    server.auth.default(jwtAuthentication.name);

    server.route([
      {
        method: "GET",
        path: "/",
        options: { auth: false },
        handler: async (req, res) => {
          return "Welcome to Karate Stars API!!";
        }
      }
    ]);

    // initialize users routes
    userRoutes().forEach((route: hapi.ServerRoute) => {
      server.route(route);
    });

    // initialize social news routes
    socialNewsRoutes().forEach((route: hapi.ServerRoute) => {
      server.route(route);
    });

    // initialize current news routes
    currentNewsRoutes().forEach((route: hapi.ServerRoute) => {
      server.route(route);
    });

    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
  console.log("Server running at:", server.info.uri);
}

start();
