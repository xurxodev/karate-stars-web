import { useState } from "react";
import Bloc from "./Bloc";

interface BlocBuilderProps<B extends Bloc<S>, S> {
    bloc: B;
    builder: (state: S) => JSX.Element;
}

const BlocBuilder = <B extends Bloc<S>, S>({ bloc, builder }: BlocBuilderProps<B, S>) => {
    const [state, setState] = useState(bloc.getState);

    bloc.subscribe((state: S) => {
        setState(state);
    });

    return builder(state);
};

export default BlocBuilder;
