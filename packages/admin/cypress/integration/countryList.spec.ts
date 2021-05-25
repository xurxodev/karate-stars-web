describe("Countries page", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("#/countries");
    });

    it("should show rows", () => {
        cy.findAllByRole("row").should("have.length.greaterThan", 1);
    });

    it("should search by text", () => {
        cy.findByPlaceholderText("Search ...").type("Spain");
        cy.findAllByRole("row").should("have.length", 2);
    });
});
