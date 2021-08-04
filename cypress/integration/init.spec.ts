/// <reference types="Cypress" />
// init.spec.ts created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

describe('Initialize App', () => {
    const appURL = 'http://localhost:3334/';
    before(() => {
        cy.visit(appURL);
    });
    after(async () => {
    });
    it('should launch the app', () => {
        cy.get('#spanAppName')
            .should('have.text', 'YADD')
        cy.get('#btnAddNewService')
            .should('not.be.null');
        cy.get('#footer')
            .should('not.be.empty');
    });
});