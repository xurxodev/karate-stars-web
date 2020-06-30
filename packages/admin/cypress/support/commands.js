// <reference types="Cypress" />
/* global Cypress, cy */

const username = Cypress.env("USERNAME");
const password = Cypress.env("PASSWORD");
const apiUrl = Cypress.env("API_URL");

if (!username) {
    throw new Error("CYPRESS_USERNAME not set");
}

if (!password) {
    throw new Error("CYPRESS_PASSWORD not set");
}

if (!apiUrl) {
    throw new Error("CYPRESS_API_URL not set");
}

Cypress.Commands.add("login", () => {
    cy.request({
        method: "POST",
        url: `apiUrl/login`,
        body: {
            user: {
                username,
                password,
            },
        },
    }).then(resp => {
        window.localStorage.setItem("apiToken", resp.headers["authorization"]);
    });
});
