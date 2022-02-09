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
        cy.findByLabelText("Type (*)").select("Z8JRebUhjRB");
        cy.findByLabelText("Start Date (*)").clear().type("2021-05-06");
        cy.findByLabelText("end Date (*)").clear().type("2021-05-08");
        cy.findByLabelText("Url (*)")
            .clear()
            .type("https://olympics.com/es/olympic-games/tokyo-2020/results/karate");
        cy.findByRole("button", { name: /accept/i }).click();
        cy.findByText("Event saved!");
    }
});
