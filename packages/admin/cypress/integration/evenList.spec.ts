describe("Event Types page", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("#/events");
    });

    it("should show rows", () => {
        cy.findAllByRole("row").should("have.length.greaterThan", 1);
    });

    it("should search by text", () => {
        cy.findByPlaceholderText("Search ...").type("World Championships Granada 1992");
        cy.findAllByRole("row").should("have.length", 2);
    });
});
