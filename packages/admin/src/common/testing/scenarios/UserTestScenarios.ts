import * as CompositionRoot from "../../../CompositionRoot";
import { MockTokenStorage } from "../mocks/MockTokenStorage";
import * as mockServerTest from "../../testing/mockServerTest";

export function givenAValidAuthenticatedUser() {
    CompositionRoot.reset();

    CompositionRoot.di.bindLazySingleton(
        CompositionRoot.names.tokenStorage,
        () => new MockTokenStorage()
    );

    const user = {
        id: "ID",
        name: "NAME",
        image: "IMAGE",
        email: "EMAIL",
        password: "PASSWORD",
        isAdmin: true,
        isClientUser: true,
    };

    mockServerTest.addRequestHandlers([
        {
            method: "get",
            endpoint: "/api/v1/me",
            httpStatusCode: 200,
            response: user,
        },
    ]);

    return user;
}

export function givenANonAuthenticatedUser() {
    CompositionRoot.reset();

    CompositionRoot.di.bindLazySingleton(
        CompositionRoot.names.tokenStorage,
        () => new MockTokenStorage(false)
    );

    mockServerTest.addRequestHandlers([
        {
            method: "get",
            endpoint: "/api/v1/me",
            httpStatusCode: 401,
            response: {
                statusCode: 401,
                error: "error",
                message: "message",
            },
        },
    ]);
}

export function givenAnUnauthorizedUser() {
    CompositionRoot.reset();

    CompositionRoot.di.bindLazySingleton(
        CompositionRoot.names.tokenStorage,
        () => new MockTokenStorage()
    );

    mockServerTest.addRequestHandlers([
        {
            method: "get",
            endpoint: "/api/v1/me",
            httpStatusCode: 401,
            response: {
                statusCode: 401,
                error: "error",
                message: "message",
            },
        },
    ]);
}
