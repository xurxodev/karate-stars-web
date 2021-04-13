export type ValidationErrorKey =
    | "field_cannot_be_blank"
    | "invalid_field"
    | "field_number_must_be_greater_than_0"
    | "invalid_dependency";

export const validationErrorMessages: Record<ValidationErrorKey, (field: string) => string> = {
    field_cannot_be_blank: (field: string) => `${capitalize(field)} cannot be blank`,
    invalid_field: (field: string) => `Invalid ${field.toLowerCase()}`,
    field_number_must_be_greater_than_0: (field: string) => `${capitalize(field)} cannot be 0`,
    invalid_dependency: (field: string) => `Invalid dependency ${capitalize(field)}`,
};

function capitalize(text: string) {
    if (typeof text !== "string") return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export type ValidationError<T> = {
    type: string;
    property: keyof T;
    value: unknown;
    errors: ValidationErrorKey[];
};
