context("Login page", () => {
    it("has page title", () => {
        cy.visit("/");
        cy.contains("Login")
        cy.url().should('include', '/login')
    });
});