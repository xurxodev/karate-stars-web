const username = Cypress.env("USERNAME");
const password = Cypress.env("PASSWORD");

context("Login page", () => {
    beforeEach(() => {
        cy.visit("/");
        cy.contains("Login");
        cy.url().should("include", "/login");
    })

    it("should realize login", () => {

        cy.findByLabelText("Email").type(username);
        // {enter} causes the form to submit
        cy.findByLabelText("Password").type(`${password}{enter}`);

        cy.url().should("include", "/dashboard");
    });
    it("should show invalid credentials if password is wrong", () => {
        cy.findByLabelText("Email").type(username);
        // {enter} causes the form to submit
        cy.findByLabelText("Password").type(`Wrong password{enter}`)

        cy.findByText("Invalid credentials");
    });
});