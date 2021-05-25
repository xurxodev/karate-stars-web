describe("Categories page", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("#/categories");
    });

    it("should show rows", () => {
        cy.findAllByRole("row").should("have.length.greaterThan", 1);
    });

    it("should search by text", () => {
        cy.findByPlaceholderText("Search ...").type("Female Kumite -50 Kg");
        cy.findAllByRole("row").should("have.length", 2);
    });
});
