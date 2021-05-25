describe("Competitors page", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("#/competitors");
    });

    it("should show rows", () => {
        cy.findAllByRole("row").should("have.length.greaterThan", 1);
    });

    it("should search by text", () => {
        cy.findByPlaceholderText("Search ...").type("Aghayev");
        cy.findAllByRole("row").should("have.length", 2);
    });
});
