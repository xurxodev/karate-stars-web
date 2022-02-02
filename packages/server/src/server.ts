import * as hapi from "@hapi/hapi";
import initializeRoutes from "./routes";
import * as jwt from "hapi-auth-jwt2";
import * as inert from "@hapi/inert";
import * as CompositionRoot from "./CompositionRoot";
import * as http from "http";
import { appDIKeys } from "./CompositionRoot";

/* eslint-disable @typescript-eslint/no-unused-vars */
import _newrelic from "newrelic";

export interface TokenData {
    userId: string;
}

export interface JwtAuthenticator {
    name: string;
    secretKey: string;
    validateTokenData: (tokenData: TokenData) => Promise<{ isValid: boolean }>;
    generateToken: (userId: string) => string;
    decodeTokenData(token: string): TokenData;
}

export class Server {
    server: hapi.Server = new hapi.Server({
        host: "0.0.0.0",
        port: process.env.PORT || 8000,
    });

    async setupServer() {
        await this.server.register(jwt);
        await this.server.register(inert);

        const jwtAuthenticator = CompositionRoot.di.get<JwtAuthenticator>(
            appDIKeys.jwtAuthenticator
        );

        const validate = function (decoded, _request, _h) {
            return jwtAuthenticator.validateTokenData(decoded);
        };

        this.server.auth.strategy(jwtAuthenticator.name, "jwt", {
            key: jwtAuthenticator.secretKey,
            validate,
        });

        this.server.auth.default(jwtAuthenticator.name);

        initializeRoutes(this.server);
    }

    async start() {
        await this.setupServer();
        await this.server.start();
        console.log(`Server running at: ${this.server.info.uri}`);
    }

    async init(): Promise<http.Server> {
        await this.setupServer();
        await this.server.initialize();

        return this.server.listener;
    }

    async stop() {
        this.server.stop();
    }
}

process.on("unhandledRejection", err => {
    console.log(err);
    process.exit(1);
});

process.on("uncaughtException", err => {
    console.log(err);
    process.exit(1);
});
