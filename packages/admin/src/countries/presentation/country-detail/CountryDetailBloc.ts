import {
    FormState,
    FormSectionState,
    statetoData,
} from "../../../common/presentation/state/FormState";
import { Either, Country, CountryData, ValidationError } from "karate-stars-core";
import { DataError } from "../../../common/domain/Errors";
import DetailBloc from "../../../common/presentation/bloc/DetailBloc";
import GetCountryByIdUseCase from "../../domain/GetCountryByIdUseCase";
import SaveCountryUseCase from "../../domain/SaveCountryUseCase";

class CountryDetailBloc extends DetailBloc<CountryData> {
    constructor(
        private getCountryByIdUseCase: GetCountryByIdUseCase,
        private saveEventTypeUseCase: SaveCountryUseCase
    ) {
        super("Country");
    }

    protected getItem(id: string): Promise<Either<DataError, CountryData>> {
        return this.getCountryByIdUseCase.execute(id);
    }

    protected async mapItemToFormSectionsState(item?: CountryData): Promise<FormSectionState[]> {
        return initialFieldsState(item);
    }

    protected saveItem(item: CountryData): Promise<Either<DataError, true>> {
        return this.saveEventTypeUseCase.execute(Country.create(item).get());
    }

    protected validateFormState(state: FormState): ValidationError<CountryData>[] | null {
        const result = Country.create(statetoData(state));

        const errors = result.fold(
            errors => errors,
            () => null
        );

        return errors;
    }
}

export default CountryDetailBloc;

const initialFieldsState = (data?: CountryData): FormSectionState[] => {
    return [
        {
            fields: [
                { label: "Id", name: "id", value: data?.id, hide: true },
                {
                    label: "Image",
                    name: "image",
                    type: "file",
                    imageType: "image",
                    alt: data?.name,
                    value: data?.image,
                    accept: "image/*",
                },
                { label: "Name", name: "name", required: true, value: data?.name, md: 6, xs: 12 },
                {
                    label: "Iso2",
                    name: "iso2",
                    required: true,
                    value: data?.iso2,
                    maxLength: 2,
                    md: 6,
                    xs: 12,
                },
            ],
        },
    ];
};
