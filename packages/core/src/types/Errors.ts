export type ValidationErrorKey = "field_cannot_be_blank" | "invalid_field";

export const validationErrorMessages: Record<ValidationErrorKey, (field: string) => string> = {
    field_cannot_be_blank: (field: string) => `${capitalize(field)} cannot be blank`,
    invalid_field: (field: string) => `Invalid ${field.toLowerCase()}`,
};

function capitalize(text: string) {
    if (typeof text !== "string") return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export type ValidationErrors = ValidationErrorKey[];
export type ValidationErrorsDictionary = Record<string, ValidationErrors>;
