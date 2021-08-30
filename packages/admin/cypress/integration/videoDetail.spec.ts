describe("Video detail page", () => {
    describe("New", () => {
        beforeEach(() => {
            cy.login();
            cy.visit("#/videos/new");

            cy.intercept("POST", "/api/v1/videos", {
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
            cy.visit("#/videos/edit/RB5VUcdkd1l");

            cy.intercept("PUT", "/api/v1/videos/RB5VUcdkd1l", {
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
        cy.findByLabelText("Title (*)").clear().type("Olympic Games 2020");
        cy.findByLabelText("Subtitle (*)").clear().type("S. Sanchez vs K. Shimizu");
        cy.findByLabelText("Description (*)").clear().type("Final Female Kata");
        cy.findByLabelText("Event Date (*)").clear().type("2021-05-08");
        cy.findByLabelText("Order (*)").type("0");
        cy.findByLabelText("Competitors (*)").focus().click({ force: true });
        cy.findByText("Sandra Sanchez Jaime").click();

        cy.findByLabelText("Competitors (*)").focus().click({ force: true });
        cy.findByText("Kiyou Shimizu").click();

        typeValidLinkForm();

        cy.findByRole("button", { name: /accept/i })
            .should("be.enabled")
            .click();

        cy.findByText("Video saved!");
    }

    function typeValidLinkForm() {
        cy.findByRole("button", { name: /add/i }).click();

        cy.findByLabelText("Id (*)").type("qE18hRFs8V7");
        cy.findByLabelText("Type (*)").select("youtube");

        cy.findByRole("button", { name: /ok/i }).click();
    }
});
