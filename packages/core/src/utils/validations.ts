import { ValidationErrorKey } from "../types/Errors";

export function validateRequired(value: any): ValidationErrorKey[] {
    const isBlank = !value || (value.length !== undefined && value.length === 0);

    return isBlank ? ["field_cannot_be_blank"] : [];
}

export function validateRequiredNumber(value: number): ValidationErrorKey[] {
    const isNonrequiredValue = !value || value <= 0;

    return isNonrequiredValue ? ["field_number_must_be_greater_than_0"] : [];
}

export function validateRegexp(value: string, regexp: RegExp): ValidationErrorKey[] {
    return regexp.test(value) ? [] : ["invalid_field"];
}
