import { useContext } from "react";
import React from "react";
import AppBloc from "./AppBloc";

export const AppBlocContext = React.createContext<AppBloc | undefined>(undefined);

export function useAppBlocContext() {
    const context = useContext(AppBlocContext);
    if (context) {
        return context;
    } else {
        throw new Error("AppContext not found");
    }
}
