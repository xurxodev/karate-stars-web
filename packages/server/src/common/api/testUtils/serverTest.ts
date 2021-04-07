import * as http from "http";
import * as jwt from "jsonwebtoken";
import * as CompositionRoot from "../../../CompositionRoot";
import { appDIKeys } from "../../../CompositionRoot";
import { Server, JwtAuthenticator, TokenData } from "../../../server";

let server: Server;

const fakeSecretKey = "fakeSecretKey";

export const fakeAuthenticator: JwtAuthenticator = {
    name: "jwt Authentication",
    secretKey: fakeSecretKey,
    validateTokenData: async (_tokenData: TokenData) => {
        return { isValid: true };
    },
    generateToken: (userId: string) => {
        const tokenData: TokenData = {
            userId: userId,
        };

        return jwt.sign(tokenData, fakeSecretKey, { expiresIn: "24h" });
    },
    decodeTokenData: (token: string) => {
        return jwt.verify(token.replace("Bearer ", ""), fakeSecretKey) as TokenData;
    },
};

export const generateToken = (userId: string) => fakeAuthenticator.generateToken(userId);

beforeEach(() => {
    CompositionRoot.reset();
    CompositionRoot.di.bindLazySingleton(appDIKeys.jwtAuthenticator, () => fakeAuthenticator);
});

afterEach(() => {
    if (server) {
        server.stop();
    }
});

export const initServer = async (): Promise<http.Server> => {
    server = new Server();
    return server.init();
};
