export interface FormResultError {
    kind: "FormResultError";
    message: string;
}

export interface FormResultSuccess {
    kind: "FormResultSuccess";
    message: string;
}

export type GridSize = "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type FormResult = FormResultError | FormResultSuccess;

export interface SelectOption {
    id: string;
    name: string;
}

export interface FormFieldState {
    label: string;
    name: string;
    alt?: string;
    errors?: string[];
    value?: string;
    selectOptions?: SelectOption[];
    required?: boolean;
    xs?: GridSize;
    sm?: GridSize;
    md?: GridSize;
    lg?: GridSize;
    xl?: GridSize;
    autoComplete?: string;
    type?: string;
    accept?: string;
    hide?: boolean;
}

export interface FormSectionState {
    title?: string;
    xs?: GridSize;
    sm?: GridSize;
    md?: GridSize;
    lg?: GridSize;
    xl?: GridSize;
    fields: FormFieldState[];
}

export interface FormState {
    isValid: boolean;
    sections: FormSectionState[];
    result?: FormResult;
    submitName?: string;
    submitfullWidth?: boolean;
    showCancel?: boolean;
    cancelName?: string;
}

export function statetoData<T>(state: FormState): T {
    const fields = state.sections.flatMap(section =>
        section.fields.map(field => ({ [field.name]: field.value }))
    );

    return Object.assign({}, ...fields);
}
