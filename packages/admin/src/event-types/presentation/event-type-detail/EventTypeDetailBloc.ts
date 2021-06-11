import {
    FormState,
    FormSectionState,
    statetoData,
} from "../../../common/presentation/state/FormState";
import { Either, EventType, EventTypeData, ValidationError } from "karate-stars-core";
import { DataError } from "../../../common/domain/Errors";
import GetEventTypeByIdUseCase from "../../domain/GetEventTypeByIdUseCase";
import SaveEventTypeUseCase from "../../domain/SaveEventTypeUseCase";
import DetailBloc from "../../../common/presentation/bloc/DetailBloc";

class EventTypeDetailBloc extends DetailBloc<EventTypeData> {
    constructor(
        private getEventTypeByIdUseCase: GetEventTypeByIdUseCase,
        private saveEventTypeUseCase: SaveEventTypeUseCase
    ) {
        super("Event Type");
    }

    protected getItem(id: string): Promise<Either<DataError, EventTypeData>> {
        return this.getEventTypeByIdUseCase.execute(id);
    }

    protected mapItemToFormSectionsState(item?: EventTypeData): FormSectionState[] {
        return initialFieldsState(item);
    }

    protected saveItem(item: EventTypeData): Promise<Either<DataError, true>> {
        return this.saveEventTypeUseCase.execute(EventType.create(item).get());
    }

    protected validateFormState(state: FormState): ValidationError<EventTypeData>[] | null {
        const result = EventType.create(statetoData(state));

        const errors = result.fold(
            errors => errors,
            () => null
        );

        return errors;
    }
}

export default EventTypeDetailBloc;

const initialFieldsState = (eventType?: EventTypeData): FormSectionState[] => {
    return [
        {
            fields: [
                { label: "Id", name: "id", value: eventType?.id, hide: true },
                { label: "Name", name: "name", required: true, value: eventType?.name },
            ],
        },
    ];
};
