import request from "supertest";

export function jsonParser(
    res: request.Response,
    callback: (err: Error | null, body: any) => void
) {
    res.text = "";
    res.setEncoding("utf8");
    res.on("data", chunk => {
        res.text += chunk;
    });
    res.on("end", () => {
        let body;
        let err;
        try {
            body = res.text && JSON.parse(res.text, reviver);
        } catch (err_) {
            err = err_;
            // issue #675: return the raw response if the response parsing fails
            err.rawResponse = res.text || null;
            // issue #876: return the http status code if the response parsing fails
            err.statusCode = res.status;
        } finally {
            callback(err, body);
        }
    });
}

const dateFormat = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

function reviver(_key, value: any) {
    if (typeof value === "string" && dateFormat.test(value)) {
        return new Date(value);
    }

    return value;
}
