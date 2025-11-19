import { USER_PASSWORD, USER_USERNAME } from '../support/config';

describe('App', () => {
  describe('default screen', () => {
    it('should have the correct title', () => {
      cy.visit('/');
      cy.title().should('include', 'Ionic App');
    });
  });

  it('entrypoint should redirect to home when logged in', () => {
    cy.login(USER_USERNAME, USER_PASSWORD);
    cy.visit('/');
    cy.url().should('eq', `${Cypress.config().baseUrl}tabs/home`);
  });
});
