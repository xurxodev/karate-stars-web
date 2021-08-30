describe("Category type detail page", () => {
    describe("New", () => {
        beforeEach(() => {
            cy.login();
            cy.visit("#/category-types/new");

            cy.intercept("POST", "/api/v1/category-types", {
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
            cy.visit("#/category-types/edit/qWPs4i1e78g");

            cy.intercept("PUT", "/api/v1/category-types/qWPs4i1e78g", {
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
        cy.findByLabelText("Name (*)").clear().type("Kata");

        cy.findByRole("button", { name: /accept/i }).click();

        cy.findByText("Category Type saved!");
    }
});
