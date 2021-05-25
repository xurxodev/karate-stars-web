describe("Category Types page", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("#/category-types");
    });

    it("should show rows", () => {
        cy.findAllByRole("row").should("have.length.greaterThan", 1);
    });

    it("should search by text", () => {
        cy.findByPlaceholderText("Search ...").type("Kumite");
        cy.findAllByRole("row").should("have.length", 2);
    });
});
