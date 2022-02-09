describe("Events page", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("#/event-types");
    });

    it("should show rows", () => {
        cy.findAllByRole("row").should("have.length.greaterThan", 1);
    });

    it("should search by text", () => {
        cy.findByPlaceholderText("Search ...").type("World Championships");
        cy.findAllByRole("row").should("have.length", 2);
    });
});
