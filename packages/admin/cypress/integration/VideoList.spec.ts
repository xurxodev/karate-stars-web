describe("Videos page", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("#/videos");
    });

    it("should show rows", () => {
        cy.findAllByRole("row").should("have.length.greaterThan", 1);
    });

    it("should search by text", () => {
        cy.findByPlaceholderText("Search ...").type("A. Biamonti (FRA) - B. Kandaz (TUR)");
        cy.findAllByRole("row").should("have.length", 2);
    });
});
