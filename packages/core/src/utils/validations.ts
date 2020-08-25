import { ValidationErrors } from "../types/Errors";

export function validateRequired(value: any, field: string): ValidationErrors {
    const isBlank = !value || (value.length !== undefined && value.length === 0);

    return isBlank ? [`${capitalize(field)} cannot be blank`] : [];
}

export function validateRegexp(value: string, field: string, regexp: RegExp): ValidationErrors {
    return regexp.test(value) ? [] : [`Invalid ${field.toLowerCase()}`];
}

function capitalize(text: string) {
    if (typeof text !== "string") return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
}
