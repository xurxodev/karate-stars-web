import React, { useContext } from "react";
import MinimalLayout from "../../common/presentation/layouts/minimal/MinimalLayout";
import CompositionRoot from "../../CompositionRoot";
import LoginBloc from "./LoginBloc";
import LoginContent from "./LoginContent";

const LoginBlocContext = React.createContext<LoginBloc | undefined>(undefined);

export function useLoginBloc() {
    const context = useContext(LoginBlocContext);
    if (context) {
        return context;
    } else {
        throw new Error("Context not found");
    }
}

export const LoginPage: React.FC = () => {
    // useEffect(() => {
    //     return loginBloc.dispose;
    // }, [loginBloc]);

    const loginBloc = CompositionRoot.getInstance().provideLogicBloc();

    return (
        <MinimalLayout>
            <LoginBlocContext.Provider value={loginBloc}>
                <LoginContent />
            </LoginBlocContext.Provider>
        </MinimalLayout>
    );
};

export default LoginPage;
