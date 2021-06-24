import {
    FormState,
    FormSectionState,
    statetoData,
} from "../../../common/presentation/state/FormState";
import { Event, EventData, EventTypeData, Either, ValidationError } from "karate-stars-core";
import { DataError } from "../../../common/domain/Errors";
import DetailBloc from "../../../common/presentation/bloc/DetailBloc";
import GetEventByIdUseCase from "../../domain/GetEventByIdUseCase";
import SaveEventUseCase from "../../domain/SaveEventUseCase";
import GetEventTypesUseCase from "../../../event-types/domain/GetEventTypesUseCase";

class EventDetailBloc extends DetailBloc<EventData> {
    constructor(
        private getEventByIdUseCase: GetEventByIdUseCase,
        private saveEventUseCase: SaveEventUseCase,
        private getEventTypesUseCase: GetEventTypesUseCase
    ) {
        super("Event");
    }

    protected getItem(id: string): Promise<Either<DataError, EventData>> {
        return this.getEventByIdUseCase.execute(id);
    }
    protected async mapItemToFormSectionsState(item?: EventData): Promise<FormSectionState[]> {
        const EventTypes = (await this.getEventTypesUseCase.execute()).fold(
            () => [],
            types => types
        );

        return initialFieldsState(EventTypes, item);
    }
    protected saveItem(item: EventData): Promise<Either<DataError, true>> {
        return this.saveEventUseCase.execute(Event.create(item).get());
    }

    protected validateFormState(state: FormState): ValidationError<EventData>[] | null {
        const result = Event.create(statetoData(state));
        const errors = result.fold(
            errors => errors,
            () => null
        );

        return errors;
    }
}

export default EventDetailBloc;

const initialFieldsState = (
    eventTypes: EventTypeData[],
    entity?: EventData
): FormSectionState[] => {
    const typeOptions = eventTypes.map(type => ({ id: type.id, name: type.name }));

    return [
        {
            fields: [
                { label: "Id", name: "id", value: entity?.id, hide: true },
                { label: "Name", name: "name", required: true, value: entity?.name },
                {
                    label: "Year",
                    name: "year",
                    required: true,
                    value: entity?.year.toString(),
                    md: 6,
                    xs: 12,
                },
                {
                    label: "Type",
                    name: "typeId",
                    required: true,
                    value: entity?.typeId ?? typeOptions[0].id,
                    selectOptions: typeOptions,
                    md: 6,
                    xs: 12,
                },
            ],
        },
    ];
};
