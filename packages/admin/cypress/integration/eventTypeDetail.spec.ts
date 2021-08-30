describe("Event type detail page", () => {
    describe("New", () => {
        beforeEach(() => {
            cy.login();
            cy.visit("#/event-types/new");

            cy.intercept("POST", "/api/v1/event-types", {
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
            cy.visit("#/event-types/edit/Jr6N73CZWtE");

            cy.intercept("PUT", "/api/v1/event-types/Jr6N73CZWtE", {
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
        cy.findByLabelText("Name (*)").clear().type("World Championships");

        cy.findByRole("button", { name: /accept/i }).click();

        cy.findByText("Event Type saved!");
    }
});
