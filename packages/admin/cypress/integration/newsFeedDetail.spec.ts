describe("News Feeds page", () => {
    describe("New", () => {
        beforeEach(() => {
            cy.login();
            cy.visit("#/news-feeds/new");

            cy.intercept("POST", "/api/v1/news-feeds", {
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
            cy.visit("#/news-feeds/edit/llMKGYg0Ri1");

            cy.intercept("PUT", "/api/v1/news-feeds/llMKGYg0Ri1", {
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
        cy.findByLabelText("Name (*)").clear().type("WKF News Center");
        cy.findByLabelText("Url (*)")
            .clear()
            .type("http://fetchrss.com/rss/59baa0d28a93f8a1048b4567777611407.xml");
        cy.findByLabelText("Language (*)").clear().type("en");

        cy.findByLabelText("Type (*)").click();
        cy.findByText("RSS").click();

        cy.findByRole("button", { name: /accept/i }).click();

        cy.findByText("News feed saved!");
    }
});
