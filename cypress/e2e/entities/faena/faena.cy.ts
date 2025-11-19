import { USER_PASSWORD, USER_USERNAME } from '../../../support/config';
import { FaenaComponentsPage, FaenaDetailPage, FaenaUpdatePage } from '../../../support/pages/entities/faena/faena.po';
import faenaSample from './faena.json';

describe('Faena entity', () => {
  const COMPONENT_TITLE = 'Faenas';
  const SUBCOMPONENT_TITLE = 'Faena';

  const faenaPageUrl = '/tabs/entities/faena';
  const faenaApiUrl = '/api/faenas';

  const faenaComponentsPage = new FaenaComponentsPage();
  const faenaUpdatePage = new FaenaUpdatePage();
  const faenaDetailPage = new FaenaDetailPage();

  let faena: any;

  beforeEach(() => {
    faena = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load Faenas page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      faenaComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', faenaPageUrl);

      faenaComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create Faena page and go back', () => {
      cy.visit(faenaPageUrl);
      faenaComponentsPage.clickOnCreateButton();

      faenaUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      faenaUpdatePage.back();
      cy.url().should('include', faenaPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: faenaApiUrl,
        body: faenaSample,
      }).then(({ body }) => {
        faena = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${faenaApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [faena],
          },
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (faena) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${faenaApiUrl}/${faena.id}`,
        }).then(() => {
          faena = undefined;
        });
      }
    });

    it('should open Faena view, open Faena edit and go back', () => {
      cy.visit(faenaPageUrl);
      faenaComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      faenaDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (faena.nombre !== undefined && faena.nombre !== null) {
        faenaDetailPage.getNombreContent().contains(faena.nombre);
      }
      faenaDetailPage.edit();

      faenaUpdatePage.back();
      faenaDetailPage.back();
      cy.url().should('include', faenaPageUrl);
    });

    it('should open Faena view, open Faena edit and save', () => {
      cy.visit(faenaPageUrl);
      faenaComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      faenaDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      faenaDetailPage.edit();

      faenaUpdatePage.save();
      cy.url().should('include', faenaPageUrl);
    });

    it('should delete Faena', () => {
      cy.visit(faenaPageUrl);
      faenaComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      faenaDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      faenaComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      faena = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: faenaApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (faena) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${faenaApiUrl}/${faena.id}`,
        }).then(() => {
          faena = undefined;
        });
      }
    });

    it('should create Faena', () => {
      cy.visit(`${faenaPageUrl}/new`);

      faenaUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (faenaSample.nombre !== undefined && faenaSample.nombre !== null) {
        faenaUpdatePage.setNombreInput(faenaSample.nombre);
      }
      faenaUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        faena = body;
      });

      faenaComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
