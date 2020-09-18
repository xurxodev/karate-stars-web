import { ValidationErrors } from "../types/Errors";

export function validateRequired(value: any): ValidationErrors {
    const isBlank = !value || (value.length !== undefined && value.length === 0);

    return isBlank ? ["field_cannot_be_blank"] : [];
}

export function validateRegexp(value: string, regexp: RegExp): ValidationErrors {
    return regexp.test(value) ? [] : ["invalid_field"];
}
