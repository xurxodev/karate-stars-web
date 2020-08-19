import React from "react";

import { Router, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
const history = createMemoryHistory();

interface RedirectTesterProps {
    componentWithRedirection: React.ComponentType;
    expectedRedirectUrl: string;
}

const RedirectTester: React.FC<RedirectTesterProps> = ({
    componentWithRedirection,
    expectedRedirectUrl,
}) => (
    <Router history={history}>
        <Route path="/" exact={true} component={componentWithRedirection} />
        <Route path={expectedRedirectUrl} render={() => <div>{expectedRedirectUrl}</div>} />
    </Router>
);

export default RedirectTester;
