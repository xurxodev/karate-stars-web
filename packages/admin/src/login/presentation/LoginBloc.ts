import Bloc from "../../common/bloc";
import { LoginState, LoginOkState, LoginFormState } from "./LoginState";
import { Email } from "../domain/Email";
import { isLeft } from "../../common/domain/Either"
import { Password } from "../domain/password";

class LoginBloc extends Bloc<LoginState>{

    constructor() {
        super({
            kind: "loginForm",
            isValid: false,
            email: { name: "email" },
            password: { name: "password" },
        })
    }

    changeEmail(emailInput: string) {
        const email = Email.create(emailInput);

        const formState = this.getState as LoginFormState

        const emailError = isLeft(email) ? "Invalid email" : undefined;

        this.changeState({
            ...formState,
            isValid: !(formState.email.error && formState.password.error),
            email: {
                ...formState.email,
                value: emailInput,
                error: emailError
            }
        });
    }

    changePassword(passwordInput: string) {
        debugger;
        const password = Password.create(passwordInput);

        const formState = this.getState as LoginFormState

        const passwordError = isLeft(password) ? "Invalid password" : undefined;

        this.changeState({
            ...formState,
            isValid: !(formState.email.error && formState.password.error),
            password: {
                ...formState.password,
                value: passwordInput,
                error: passwordError
            }
        });
    }

    login() {
        //loginUseCase.execute

        // error
        const formState = this.getState as LoginFormState
        this.changeState({ ...formState, error: "Invalid credentials" })

        //sucess
        this.changeState({} as LoginOkState)
    }
}

export default LoginBloc;