export type UnexpectedError = {
    kind: "UnexpectedError";
    error: Error;
};

export type ResourceNotFound = {
    kind: "ResourceNotFound";
    message: string;
};
