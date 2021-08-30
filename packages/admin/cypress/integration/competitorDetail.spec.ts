describe("Competitor detail page", () => {
    describe("New", () => {
        beforeEach(() => {
            cy.login();
            cy.visit("#/competitors/new");

            cy.intercept("POST", "/api/v1/competitors", {
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
            cy.visit("#/competitors/edit/tjZtIOHwzVJ");

            cy.intercept("PUT", "/api/v1/competitors/tjZtIOHwzVJ", {
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
        cy.findByLabelText("First Name (*)").clear().type("Rafael");
        cy.findByLabelText("Last Name (*)").clear().type("Aghayev");
        cy.findByLabelText("WKF Id (*)").clear().type("AZE133");
        cy.findByLabelText("Country (*)").select("Azerbaijan");
        cy.findByLabelText("Category (*)").select("Male Kumite -75 Kg");
        cy.findByLabelText("Active").click();
        cy.findByLabelText("Legend").click();
        cy.findByLabelText("Biography (*)")
            .clear()
            .type("Rafael Aghayev is the first karateka to be a 5-time individual world champion");

        typeValidLinkForm();
        typeValidAchievementForm();

        cy.findByRole("button", { name: /accept/i })
            .should("be.enabled")
            .click();

        cy.findByText("Competitor saved!");
    }

    function typeValidLinkForm() {
        cy.findByRole("button", { name: /add link/i }).click();

        cy.findByLabelText("Url (*)").type("https://aghayev.com");
        cy.findByLabelText("Type (*)").select("web");

        cy.findByRole("button", { name: /ok/i }).click();
    }

    function typeValidAchievementForm() {
        cy.findByRole("button", { name: /add achievement/i }).click();

        cy.wait(1000);

        cy.findByLabelText("Position (*)").type("1");
        cy.findByLabelText("Achievement Category (*)").select("Male Kumite -70 Kg", {
            force: true,
        });
        cy.findByLabelText("Event (*)").select("World Championships Tampere 2006");

        cy.findByRole("button", { name: /ok/i }).click();
    }
});
