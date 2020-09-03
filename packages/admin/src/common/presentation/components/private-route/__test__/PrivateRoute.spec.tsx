import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "../../../../testing/testing_library/custom";
import PrivateRoute from "../PrivateRoute";
import RedirectTester from "../../../../testing/testing_library/RedirectTester";
import { pages } from "../../../../../app/AppRoutes";
import {
    givenAnUnauthorizedUser,
    givenANonAuthenticatedUser,
    givenAValidAuthenticatedUser,
} from "../../../../testing/scenarios/UserTestScenarios";

const FakeComponent = () => <span>FakeComponent</span>;
const PrivateRouteToTest = () => <PrivateRoute path="/" component={FakeComponent} />;

describe("PrivateRoute", () => {
    it("should show the content if user is authenticated", async () => {
        givenAValidAuthenticatedUser();

        render(<PrivateRouteToTest />);

        await screen.findByText("FakeComponent");
    });
    it("should edirect to login if user is not authenticated", async () => {
        givenANonAuthenticatedUser();

        render(
            <RedirectTester
                componentWithRedirection={PrivateRouteToTest}
                expectedRedirectUrl={pages.login.path}
            />
        );

        await screen.findByText(pages.login.path);
    });
    it("should redirect to login if api token is exprired", async () => {
        givenAnUnauthorizedUser();

        render(
            <RedirectTester
                componentWithRedirection={PrivateRouteToTest}
                expectedRedirectUrl={pages.login.path}
            />
        );

        await screen.findByText(pages.login.path);
    });
});
