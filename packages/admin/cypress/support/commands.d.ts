declare namespace Cypress {
    interface Chainable {
        /**
         * Custom command to realize login in API.
         * @example cy.login('greeting')
        */
        login(): Chainable<Element>
    }
}