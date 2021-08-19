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
        cy.enableAuth(false);
        cy.exec(`wait-on ${appURL}`);
        cy.visit(appURL);
    });
    after(async () => {
    });
    it('should launch the app', () => {
        cy.get('#appLogoImage')
            .should('be.visible')
            .and(img => {
                expect((img[0] as HTMLImageElement).naturalWidth).to.be.greaterThan(0);
            });
        cy.get('#btnAddNewService')
            .should('not.be.null');
        cy.get('#footer')
            .should('not.be.empty');
    });
});
describe('Initialize App - with Auth', () => {
    const appURL = 'http://localhost:3334/';
    before(() => {
        cy.enableAuth(true);
        cy.exec(`wait-on ${appURL}`);
        cy.visit(appURL);
    });
    after(async () => {
    });
    const verifyAuthScreen = () => cy.get('#h1-authentication').should('contain.text', 'Authentication Required')
        .get('#inputPassword').should('not.be.null')
        .get('#btnLoginSubmit').should('not.be.null');
    const login = () => cy.fixture("example").then(data => {
        cy.get('#inputPassword').type(data.password)
            .get('#btnLoginSubmit').click()
            .get('#btnLogout').should('not.be.null')
            .get('#btnAddNewService').should('not.be.null');
    });
    const logout = () => cy.get('#btnLogout').click();
    it('should launch the app', () => {
        cy.get('#appLogoImage')
            .should('be.visible')
            .and(img => {
                expect((img[0] as HTMLImageElement).naturalWidth).to.be.greaterThan(0);
            });
        cy.get('#footer')
            .should('not.be.empty');
        verifyAuthScreen();
    });
    it('should login with default credentials', () => {
        login();
        logout();
    });
    it('should logout', () => {
        verifyAuthScreen();
        login();
        logout();
        verifyAuthScreen();
    });
});