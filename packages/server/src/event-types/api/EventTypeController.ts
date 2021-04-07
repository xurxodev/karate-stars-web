import { GetEventTypesUseCase } from "../domain/usecases/GetEventTypesUseCase";
import { JwtAuthenticator } from "../../server";
import { Either, EventTypeData } from "karate-stars-core";
import { AdminController, UseCaseErrors } from "../../common/api/AdminController";
import { GetEventTypeByIdUseCase } from "../domain/usecases/GetEventTypeByIdUseCase";
import { CreateEventTypeUseCase } from "../domain/usecases/CreateEventTypeUseCase";
import { ActionResult } from "../../common/api/ActionResult";
import { UpdateEventTypeUseCase } from "../domain/usecases/UpdateEventTypeUseCase";
import { DeleteEventTypeUseCase } from "../domain/usecases/DeleteEventTypeUseCase";

export class EventTypeController extends AdminController<EventTypeData> {
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

    protected runGetAll(
        userId: any
    ): Promise<Either<UseCaseErrors<EventTypeData>, EventTypeData[]>> {
        return this.getEventTypesUseCase.execute({ userId });
    }

    protected runGet(
        userId: any,
        id: string
    ): Promise<Either<UseCaseErrors<EventTypeData>, EventTypeData>> {
        return this.getEventTypeByIdUseCase.execute({ userId, id });
    }

    protected runPost(
        userId: string,
        data: EventTypeData
    ): Promise<Either<UseCaseErrors<EventTypeData>, ActionResult>> {
        return this.createEventTypeUseCase.execute({ userId, data });
    }

    protected runPut(
        userId: string,
        itemId: string,
        data: EventTypeData
    ): Promise<Either<UseCaseErrors<EventTypeData>, ActionResult>> {
        return this.updateEventTypeUseCase.execute({ userId, data, itemId });
    }

    protected runDelete(
        userId: string,
        id: string
    ): Promise<Either<UseCaseErrors<EventTypeData>, ActionResult>> {
        return this.deleteEventTypeUseCase.execute({ userId, id });
    }
}
