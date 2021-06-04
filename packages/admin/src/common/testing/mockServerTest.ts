import { rest } from "msw";
import { setupServer } from "msw/node";

export type Method = "get" | "post" | "put";

export interface MockHandler {
    method: Method;
    endpoint: string;
    httpStatusCode: number;
    response: Record<string, unknown> | string | unknown[];
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
        case "get":
            return rest.get(handler.endpoint, (req, res, ctx) =>
                res(
                    ctx.status(handler.httpStatusCode),
                    typeof handler.response === "string"
                        ? ctx.text(handler.response)
                        : ctx.json(handler.response)
                )
            );
        case "post":
            return rest.post(handler.endpoint, (req, res, ctx) =>
                res(
                    ctx.status(handler.httpStatusCode),
                    typeof handler.response === "string"
                        ? ctx.text(handler.response)
                        : ctx.json(handler.response)
                )
            );
        case "put":
            return rest.put(handler.endpoint, (req, res, ctx) =>
                res(
                    ctx.status(handler.httpStatusCode),
                    typeof handler.response === "string"
                        ? ctx.text(handler.response)
                        : ctx.json(handler.response)
                )
            );
    }
}
