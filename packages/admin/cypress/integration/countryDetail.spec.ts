describe("Country detail page", () => {
    describe("New", () => {
        beforeEach(() => {
            cy.login();
            cy.visit("#/countries/new");

            cy.intercept("POST", "/api/v1/countries", {
                statusCode: 201,
                body: {
                    ok: true,
                    count: 1,
                },
            });
        });

        it("should create a new item", () => {
            typeValidForm();
        });
    });

    describe("Edit", () => {
        beforeEach(() => {
            cy.login();
            cy.visit("#/countries/edit/UCyMZcbtB4u");

            cy.intercept("PUT", "/api/v1/countries/UCyMZcbtB4u", {
                statusCode: 200,
                body: {
                    ok: true,
                    count: 1,
                },
            });
        });
        it("should edit an item", () => {
            typeValidForm();
        });
    });

    function typeValidForm() {
        cy.findByLabelText("Name (*)").clear().type("Spain");
        cy.findByLabelText("Iso2 (*)").clear().type("es");

        cy.findByRole("button", { name: /accept/i }).click();
        cy.findByText("Country saved!");
    }
});
