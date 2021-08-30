describe("Category detail page", () => {
    describe("New", () => {
        beforeEach(() => {
            cy.login();
            cy.visit("#/categories/new");

            cy.intercept("POST", "/api/v1/categories", {
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
            cy.visit("#/categories/edit/uAwCwvaoUgg");

            cy.intercept("PUT", "/api/v1/categories/uAwCwvaoUgg", {
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
        cy.findByLabelText("Name (*)").clear().type("Female Kata");
        cy.findByLabelText("Type (*)").select("qWPs4i1e78g");

        cy.findByRole("button", { name: /accept/i }).click();
        cy.findByText("Category saved!");
    }
});
