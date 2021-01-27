describe("News Feeds page", () => {
    describe("New", () => {
        beforeEach(() => {
            cy.login()
            cy.visit("#/news-feeds/new");

            cy.intercept('POST', '/api/v1/news-feeds', {
                statusCode: 201,
                body: {
                    "ok": true,
                    "count": 1
                }
            });
        })

        it("should create a new item", () => {
            cy.findByLabelText("Name (*)").type("Xurxo dev");
            cy.findByLabelText("Url (*)").type("https://xurxodev.com/");
            cy.findByLabelText("Language (*)").type("es");
            cy.findByLabelText("Type (*)").select("RSS");

            cy.findByText('Accept').click();

            cy.findByText("News feed saved!");
        });
    });

    describe("Edit", () => {
        beforeEach(() => {
            cy.login()
            cy.visit("#/news-feeds/edit/fvTIvWAVhyn");

            cy.intercept('PUT', '/api/v1/news-feeds', {
                statusCode: 200,
                body: {
                    "ok": true,
                    "count": 1
                }
            });
        })
        it("should edit an item", () => {
            cy.findByLabelText("Language (*)").type("es");

            cy.findByText('Accept').click();

            cy.findByText("News feed saved!");
        });
    });
});