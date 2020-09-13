import { FormState, FormSectionState } from "../../../common/presentation/state/FormState";
import FormBloc from "../../../common/presentation/bloc/FormBloc";

class SettingsBloc extends FormBloc {
    constructor() {
        super({
            isValid: false,
            sections: initialFieldsState,
        });
    }

    protected validateState(state: FormState): Record<string, string[]> | null {
        // const result = this.createNotification(state);
        // const errors = result.fold(
        //     errors => errors,
        //     () => null
        // );
        console.log({ state });
        return {};
    }

    async submit() {
        // if (this.state.isValid) {
        //     const creationResult = this.createNotification(this.state);
        //     const sendResult = await this.sendPushNotificationUseCase.execute(
        //         creationResult.getOrThrow()
        //     );
        //     sendResult.fold(
        //         (error: SendPushNotificationError) => this.changeState(this.handleError(error)),
        //         () =>
        //             this.changeState({
        //                 ...this.state,
        //                 result: {
        //                     kind: "FormResultSuccess",
        //                     message: "Push notification sent successfully",
        //                 },
        //             })
        //     );
        // } else {
        //     this.changeState({ ...this.state });
        // }
    }

    // private handleError(error: SendPushNotificationError): FormState {
    //     switch (error.kind) {
    //         case "Unauthorized":
    //             return {
    //                 ...this.state,
    //                 result: { kind: "FormResultError", message: "Invalid credentials" },
    //             };
    //         case "ApiError":
    //             return {
    //                 ...this.state,
    //                 result: {
    //                     kind: "FormResultError",
    //                     message: `Sorry, an error has ocurred in the server. Please try later again`,
    //                 },
    //             };
    //         case "UnexpectedError":
    //             return {
    //                 ...this.state,
    //                 result: {
    //                     kind: "FormResultError",
    //                     message: `Sorry, an error has ocurred. Please try later again`,
    //                 },
    //             };
    //     }
    // }

    // private createNotification(
    //     state: FormState
    // ): Either<ValidationErrorsDictionary, UrlNotification> {
    //     const notificationDataFields = state.sections.flatMap(section =>
    //         section.fields.map(field => ({ [field.name]: field.value })));
    //     const notificationData = Object.assign({}, ...notificationDataFields);

    //     return UrlNotification.create(notificationData);
    // }
}

export default SettingsBloc;

const initialFieldsState: FormSectionState[] = [
    {
        fields: [
            { label: "Name", name: "name", required: true },
            { label: "Url", name: "url", required: true },
            { label: "Language", name: "language", required: true },
            { label: "Type", name: "type", required: true },
            { label: "Image", name: "image", required: true },
        ],
    },
];
