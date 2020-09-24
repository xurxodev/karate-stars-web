import * as hapi from "@hapi/hapi";
import initializeRoutes from "./routes";
import * as jwt from "hapi-auth-jwt2";
import * as inert from "@hapi/inert";
import * as CompositionRoot from "./CompositionRoot";
import JwtAuthenticator from "./api/authentication/JwtAuthenticator";

const server: hapi.Server = new hapi.Server({
    host: "0.0.0.0",
    port: process.env.PORT || 8000,
});

async function start() {
    try {
        CompositionRoot.init();

        await server.register(jwt);
        await server.register(inert);

        const jwtAuthenticator = CompositionRoot.di.get(JwtAuthenticator);

        const validate = function (decoded, _request, _h) {
            return jwtAuthenticator.validateTokenData(decoded);
        };

        server.auth.strategy(jwtAuthenticator.name, "jwt", {
            key: jwtAuthenticator.secretKey,
            validate,
        });

        server.auth.default(jwtAuthenticator.name);

        initializeRoutes(server);

        await server.start();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
    console.log("Server running at:", server.info.uri);
}

start();
