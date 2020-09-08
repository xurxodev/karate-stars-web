context("Send push notification page", () => {
    beforeEach(() => {
        cy.login()
        cy.visit("#/send-push-notification");
    })

    it("should send notification sucessfully", () => {
        cy.get("select[name=topic]").select("debugurlnews");
        cy.get("input[name=url]").type("http://karatestarsapp.com");
        cy.get("input[name=title]").type("Karate stars news");
        cy.get("input[name=description]").type("Best karate app of the world!!");

        cy.get('button[type=submit]').click();

        cy.contains("Push notification sent successfully")
    });
});