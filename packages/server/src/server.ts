import * as hapi from "@hapi/hapi";
import jwtAuthentication from "./api/users/JwtAuthentication";
import initializeRoutes from "./routes";
import * as jwt from "hapi-auth-jwt2";
import * as inert from "@hapi/inert";

const server: hapi.Server = new hapi.Server({
    host: "0.0.0.0",
    port: process.env.PORT || 8000,
});

async function start() {
    try {
        await server.register(jwt);
        await server.register(inert);

        const validate = jwtAuthentication.validateHandler;
        const secretKey = jwtAuthentication.secretKey;

        server.auth.strategy(jwtAuthentication.name, "jwt", {
            key: secretKey,
            validate,
        });

        server.auth.default(jwtAuthentication.name);

        initializeRoutes(server);

        await server.start();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
    console.log("Server running at:", server.info.uri);
}

start();
