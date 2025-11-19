import { USER_PASSWORD, USER_USERNAME } from '../../../support/config';
import {
  AreaFaenaComponentsPage,
  AreaFaenaDetailPage,
  AreaFaenaUpdatePage,
} from '../../../support/pages/entities/area-faena/area-faena.po';
import areaFaenaSample from './area-faena.json';

describe('AreaFaena entity', () => {
  const COMPONENT_TITLE = 'Area Faenas';
  const SUBCOMPONENT_TITLE = 'Area Faena';

  const areaFaenaPageUrl = '/tabs/entities/area-faena';
  const areaFaenaApiUrl = '/api/area-faenas';

  const areaFaenaComponentsPage = new AreaFaenaComponentsPage();
  const areaFaenaUpdatePage = new AreaFaenaUpdatePage();
  const areaFaenaDetailPage = new AreaFaenaDetailPage();

  let areaFaena: any;

  beforeEach(() => {
    areaFaena = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load AreaFaenas page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      areaFaenaComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', areaFaenaPageUrl);

      areaFaenaComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create AreaFaena page and go back', () => {
      cy.visit(areaFaenaPageUrl);
      areaFaenaComponentsPage.clickOnCreateButton();

      areaFaenaUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      areaFaenaUpdatePage.back();
      cy.url().should('include', areaFaenaPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: areaFaenaApiUrl,
        body: areaFaenaSample,
      }).then(({ body }) => {
        areaFaena = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${areaFaenaApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [areaFaena],
          },
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (areaFaena) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${areaFaenaApiUrl}/${areaFaena.id}`,
        }).then(() => {
          areaFaena = undefined;
        });
      }
    });

    it('should open AreaFaena view, open AreaFaena edit and go back', () => {
      cy.visit(areaFaenaPageUrl);
      areaFaenaComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      areaFaenaDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      areaFaenaDetailPage.edit();

      areaFaenaUpdatePage.back();
      areaFaenaDetailPage.back();
      cy.url().should('include', areaFaenaPageUrl);
    });

    it('should open AreaFaena view, open AreaFaena edit and save', () => {
      cy.visit(areaFaenaPageUrl);
      areaFaenaComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      areaFaenaDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      areaFaenaDetailPage.edit();

      areaFaenaUpdatePage.save();
      cy.url().should('include', areaFaenaPageUrl);
    });

    it('should delete AreaFaena', () => {
      cy.visit(areaFaenaPageUrl);
      areaFaenaComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      areaFaenaDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      areaFaenaComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      areaFaena = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: areaFaenaApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (areaFaena) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${areaFaenaApiUrl}/${areaFaena.id}`,
        }).then(() => {
          areaFaena = undefined;
        });
      }
    });

    it('should create AreaFaena', () => {
      cy.visit(`${areaFaenaPageUrl}/new`);

      areaFaenaUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      areaFaenaUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        areaFaena = body;
      });

      areaFaenaComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
