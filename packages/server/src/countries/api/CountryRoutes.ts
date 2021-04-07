import * as hapi from "@hapi/hapi";

export default function (apiPrefix: string): hapi.ServerRoute[] {
    return [
        {
            method: "GET",
            path: `${apiPrefix}/countries`,
            handler: (
                _request: hapi.Request,
                _h: hapi.ResponseToolkit
            ): hapi.Lifecycle.ReturnValue => {
                return [];
            },
        },
    ];
}
