/// <reference types="Cypress" />
// init.spec.ts created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

describe('Service Flow', () => {
    const appURL = 'http://localhost:3334/';
    const newServiceData = {
        name: 'Google',
        shortName: 'google',
        url: 'https://google.com',
        logoURL: '/icons/adminer.png'
    };

    beforeEach(() => {
        cy.visit(appURL);
    });
    afterEach(async () => {

    });
    const createNewService = (service: { [key: string]: string; }) => {
        cy.get('#btnAddNewService')
            .click().get('#textNewService').should('have.text', 'New Service')
            .get('#inputNewServiceName').type(service.name)
            .get('#inputNewServiceURL').type(service.url)
            .get('#inputNewServiceShortName').type(service.shortName)
            .get('#inputNewServiceLogoURL').type(service.logoURL)
            .get('#textNewServiceMessage').should('have.text', '')
            .get('#btnNewServiceCreate').click();
    };
    const verifyService = (service: { [key: string]: string; }, exists = true) => {
        if (exists) {
            cy.get(`#status${newServiceData.shortName}`).should('not.be.null')
                .get(`#link${newServiceData.shortName}`).should('have.attr', 'href').and('include', `/${service.shortName}`)
                .get(`#img${newServiceData.shortName}`).should('have.attr', 'src').and('equal', service.logoURL)
                .get(`#text${newServiceData.shortName}Name`).should('have.text', service.name)
                .get(`#text${newServiceData.shortName}ShortName`).should('have.text', service.shortName);
        } else {
            cy.get(`#status${newServiceData.shortName}`).should('not.exist');
        }

    };
    const deleteExistingService = (service: { [key: string]: string; }) => {
        cy.get(`#btn${service.shortName}Edit`).click()
            .get(`#btnEditService${service.shortName}Delete`).click()
            .get(`#textEditService${service.shortName}Message`).should('not.be.empty')
            .get(`#btnEditService${service.shortName}Delete`).click();
    };
    it('should create a new service', () => {
        // Create new service
        createNewService(newServiceData);
        // Verify new service creation
        verifyService(newServiceData);
    });
    it('should read existing service', () => {
        verifyService(newServiceData);
    });
    it('should update existing service', () => {
        const updatedName = newServiceData.name + 'updated';
        // createNewService(newServiceData);
        verifyService(newServiceData);
        cy.get(`#btn${newServiceData.shortName}Edit`).click()
            .get(`#inputEditService${newServiceData.shortName}Name`).type(updatedName)
            .get(`#btnEditService${newServiceData.shortName}SaveChanges`).click();
        verifyService({
            ...newServiceData,
            name: newServiceData.name + updatedName
        });
    });
    it('should delete existing service', () => {
        deleteExistingService(newServiceData);
        verifyService(newServiceData, false);
    });
    it('should not allow duplicate service creation', () => {
        createNewService(newServiceData);
        verifyService(newServiceData);
        createNewService(newServiceData);
        cy.get(`#textNewServiceMessage`).should('not.be.empty');
        cy.get(`#btnNewServiceClose`).click();
        deleteExistingService(newServiceData);
        verifyService(newServiceData, false);
    });
});