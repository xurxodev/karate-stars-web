import { FormState } from "../../common/presentation/state/FormState";
import { Notification } from "../domain/entities/Notification";
import SendPushNotificationUseCase from "../domain/SendPushNotificationUseCase";
import { SendPushNotificationError } from "../domain/Errors";
import { Either, ValidationError } from "karate-stars-core";
import FormBloc from "../../common/presentation/bloc/FormBloc";

abstract class SendNotificationBloc<T extends Notification> extends FormBloc<T> {
    constructor(
        private sendPushNotificationUseCase: SendPushNotificationUseCase,
        initalState: FormState
    ) {
        super(initalState);
    }

    protected abstract createNotification(state: FormState): Either<ValidationError<T>[], T>;

    protected validateState(state: FormState): ValidationError<T>[] | null {
        const result = this.createNotification(state);
        const errors = result.fold(
            errors => errors,
            () => null
        );
        return errors;
    }

    async submit() {
        if (this.state.isValid) {
            const creationResult = this.createNotification(this.state);

            const sendResult = await this.sendPushNotificationUseCase.execute(
                creationResult.getOrThrow()
            );

            sendResult.fold(
                (error: SendPushNotificationError) => this.changeState(this.handleError(error)),
                () =>
                    this.changeState({
                        ...this.state,
                        result: {
                            kind: "FormResultSuccess",
                            message: "Push notification sent successfully",
                        },
                    })
            );
        } else {
            this.changeState({ ...this.state });
        }
    }

    private handleError(error: SendPushNotificationError): FormState {
        switch (error.kind) {
            case "Unauthorized":
                return {
                    ...this.state,
                    result: { kind: "FormResultError", message: "Invalid credentials" },
                };
            case "ApiError":
                return {
                    ...this.state,
                    result: {
                        kind: "FormResultError",
                        message: `Sorry, an error has ocurred in the server. Please try later again`,
                    },
                };
            case "UnexpectedError":
                return {
                    ...this.state,
                    result: {
                        kind: "FormResultError",
                        message: `Sorry, an error has ocurred. Please try later again`,
                    },
                };
        }
    }
}

export default SendNotificationBloc;
