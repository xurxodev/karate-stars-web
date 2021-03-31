import { GetEventTypesUseCase } from "../domain/usecases/GetEventTypesUseCase";
import { JwtAuthenticator } from "../../server";
import { Either, EventTypeRawData } from "karate-stars-core";
import { AdminController, UseCaseErrors } from "../../common/api/AdminController";
import { GetEventTypeByIdUseCase } from "../domain/usecases/GetEventTypeByIdUseCase";
import { CreateEventTypeUseCase } from "../domain/usecases/CreateEventTypeUseCase";
import { ActionResult } from "../../common/api/ActionResult";
import { UpdateEventTypeUseCase } from "../domain/usecases/UpdateEventTypeUseCase";
import { DeleteEventTypeUseCase } from "../domain/usecases/DeleteEventTypeUseCase";

export class EventTypeController extends AdminController<EventTypeRawData> {
    constructor(
        jwtAuthenticator: JwtAuthenticator,
        private getEventTypesUseCase: GetEventTypesUseCase,
        private getEventTypeByIdUseCase: GetEventTypeByIdUseCase,
        private createEventTypeUseCase: CreateEventTypeUseCase,
        private updateEventTypeUseCase: UpdateEventTypeUseCase,
        private deleteEventTypeUseCase: DeleteEventTypeUseCase
    ) {
        super(jwtAuthenticator);
    }

    protected executeGetAll(
        userId: any
    ): Promise<Either<UseCaseErrors<EventTypeRawData>, EventTypeRawData[]>> {
        return this.getEventTypesUseCase.execute({ userId });
    }

    protected executeGet(
        userId: any,
        id: string
    ): Promise<Either<UseCaseErrors<EventTypeRawData>, EventTypeRawData>> {
        return this.getEventTypeByIdUseCase.execute({ userId, id });
    }

    protected executePost(
        userId: string,
        item: EventTypeRawData
    ): Promise<Either<UseCaseErrors<EventTypeRawData>, ActionResult>> {
        return this.createEventTypeUseCase.execute({ userId, item });
    }

    protected executePut(
        userId: string,
        itemId: string,
        item: EventTypeRawData
    ): Promise<Either<UseCaseErrors<EventTypeRawData>, ActionResult>> {
        return this.updateEventTypeUseCase.execute({ userId, item, itemId });
    }

    protected executeDelete(
        userId: string,
        id: string
    ): Promise<Either<UseCaseErrors<EventTypeRawData>, ActionResult>> {
        return this.deleteEventTypeUseCase.execute({ userId, id });
    }
}
