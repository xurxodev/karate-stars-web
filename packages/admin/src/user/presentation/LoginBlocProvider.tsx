import React from "react";
import LoginBloc from "./LoginBloc";
import CompositionRoot from "../../CompositionRoot";

const loginBloc = CompositionRoot.getInstance().provideLogicBloc();

export const LoginBlocContext = React.createContext<LoginBloc>(loginBloc);

export const LoginBlocProvider: React.FC = ({ children }) => {
    // useEffect(() => {
    //     return loginBloc.dispose;
    // }, [loginBloc]);

    return <LoginBlocContext.Provider value={loginBloc}>{children}</LoginBlocContext.Provider>;
};
