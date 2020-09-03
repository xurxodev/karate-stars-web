import React, { useState } from "react";
import { pages } from "../../../../app/AppRoutes";
import { Route, Redirect, useHistory } from "react-router-dom";
import { useAppBlocContext } from "../../../../app/AppContext";
import AppState from "../../../../app/AppState";
import { makeStyles, CircularProgress } from "@material-ui/core";

const useStyles = makeStyles({
    loading: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
});

interface PrivateRouteProps {
    path: string;
    component: React.ComponentType;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ path, component }) => {
    const appBloc = useAppBlocContext();
    const history = useHistory();
    const [state, setState] = useState<AppState>(appBloc.getState);
    const classes = useStyles();

    appBloc.subscribe((state: AppState) => {
        if (state.isAuthenticated === true) {
            setState(state);
        } else {
            history.push(pages.login.path);
        }
    });

    if (state.isAuthenticated === undefined) {
        return (
            <div className={classes.loading}>
                <CircularProgress />
            </div>
        );
    } else if (state.isAuthenticated === true) {
        return <Route path={path} component={component} />;
    } else {
        return <Redirect to={pages.login.path} />;
    }
};

export default PrivateRoute;
