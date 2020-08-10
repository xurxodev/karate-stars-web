const username = Cypress.env("USERNAME");
const password = Cypress.env("PASSWORD");

//TODO: Try Cypress testing library
// With Cypress testing library
// cy.get("Email]").type(username);
// cy.get("Password]").type(password);
// cy.get("SIGN IN NOW").click();

context("Login page", () => {
    beforeEach(() => {
        cy.visit("/");
        cy.contains("Login");
        cy.url().should("include", "/login");
    })

    it("should realize login", () => {
        cy.get('input[name=email]').type(username);
        // {enter} causes the form to submit
        cy.get('input[name=password]').type(`${password}{enter}`);

        cy.url().should('include', '/dashboard');
    });
    it("should show invalid credentials if password is wrong", () => {
        cy.get('input[name=email]').type(username);
        // {enter} causes the form to submit
        cy.get('input[name=password]').type(`Wrong password{enter}`)

        cy.contains("Invalid credentials")
    });
});