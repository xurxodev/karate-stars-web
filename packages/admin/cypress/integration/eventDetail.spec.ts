describe("event detail page", () => {
    describe("New", () => {
        beforeEach(() => {
            cy.login();
            cy.visit("#/events/new");

            cy.intercept("POST", "/api/v1/events", {
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
            cy.visit("#/events/edit/lTWNoZjuBqd");

            cy.intercept("PUT", "/api/v1/events/lTWNoZjuBqd", {
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
        cy.findByLabelText("Name (*)").clear().type("Olympic Games Tokyo 2020");
        cy.findByLabelText("Year (*)").clear().type("2021");
        cy.findByLabelText("Type (*)").select("Z8JRebUhjRB");

        cy.findByRole("button", { name: /accept/i }).click();
        cy.findByText("Event saved!");
    }
});
