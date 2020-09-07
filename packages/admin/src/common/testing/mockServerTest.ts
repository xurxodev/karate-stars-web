import { rest } from "msw";
import { setupServer } from "msw/node";

export type Method = "post" | "get";

export interface MockHandler {
    method: Method;
    endpoint: string;
    httpStatusCode: number;
    response: Record<string, any> | string;
}

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

export function addRequestHandlers(handlers: MockHandler[]) {
    const mwsHandlers = handlers.map(handler => createMwsHandler(handler));
    server.use(...mwsHandlers);
}

export { server, rest };

function createMwsHandler(handler: MockHandler) {
    switch (handler.method) {
        case "post":
            return rest.post(handler.endpoint, (req, res, ctx) =>
                res(ctx.status(handler.httpStatusCode), ctx.json(handler.response))
            );
        case "get":
            return rest.get(handler.endpoint, (req, res, ctx) =>
                res(ctx.status(handler.httpStatusCode), ctx.json(handler.response))
            );
    }
}
