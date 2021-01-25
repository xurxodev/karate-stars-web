context("News Feeds page", () => {
    beforeEach(() => {
        cy.login()
        cy.visit("#/news-feeds");
    })

    it("should show news feeds", () => {
        cy.findAllByRole("row").should('have.length.greaterThan', 1);
    });

    it("should search by text", () => {
        cy.findByPlaceholderText("Search ...").type("WKF News Center")
        cy.findAllByRole("row").should('have.length.greaterThan', 2);
    });
});