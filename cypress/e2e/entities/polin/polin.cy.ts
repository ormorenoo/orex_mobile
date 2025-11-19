import { USER_PASSWORD, USER_USERNAME } from '../../../support/config';
import { PolinComponentsPage, PolinDetailPage, PolinUpdatePage } from '../../../support/pages/entities/polin/polin.po';
import polinSample from './polin.json';

describe('Polin entity', () => {
  const COMPONENT_TITLE = 'Polins';
  const SUBCOMPONENT_TITLE = 'Polin';

  const polinPageUrl = '/tabs/entities/polin';
  const polinApiUrl = '/api/polins';

  const polinComponentsPage = new PolinComponentsPage();
  const polinUpdatePage = new PolinUpdatePage();
  const polinDetailPage = new PolinDetailPage();

  let polin: any;

  beforeEach(() => {
    polin = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load Polins page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      polinComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', polinPageUrl);

      polinComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create Polin page and go back', () => {
      cy.visit(polinPageUrl);
      polinComponentsPage.clickOnCreateButton();

      polinUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      polinUpdatePage.back();
      cy.url().should('include', polinPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: polinApiUrl,
        body: polinSample,
      }).then(({ body }) => {
        polin = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${polinApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [polin],
          },
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (polin) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${polinApiUrl}/${polin.id}`,
        }).then(() => {
          polin = undefined;
        });
      }
    });

    it('should open Polin view, open Polin edit and go back', () => {
      cy.visit(polinPageUrl);
      polinComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      polinDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (polin.identificador !== undefined && polin.identificador !== null) {
        polinDetailPage.getIdentificadorContent().contains(polin.identificador);
      }
      if (polin.descripcion !== undefined && polin.descripcion !== null) {
        polinDetailPage.getDescripcionContent().contains(polin.descripcion);
      }
      polinDetailPage.edit();

      polinUpdatePage.back();
      polinDetailPage.back();
      cy.url().should('include', polinPageUrl);
    });

    it('should open Polin view, open Polin edit and save', () => {
      cy.visit(polinPageUrl);
      polinComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      polinDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      polinDetailPage.edit();

      polinUpdatePage.save();
      cy.url().should('include', polinPageUrl);
    });

    it('should delete Polin', () => {
      cy.visit(polinPageUrl);
      polinComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      polinDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      polinComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      polin = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: polinApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (polin) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${polinApiUrl}/${polin.id}`,
        }).then(() => {
          polin = undefined;
        });
      }
    });

    it('should create Polin', () => {
      cy.visit(`${polinPageUrl}/new`);

      polinUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (polinSample.identificador !== undefined && polinSample.identificador !== null) {
        polinUpdatePage.setIdentificadorInput(polinSample.identificador);
      }
      if (polinSample.descripcion !== undefined && polinSample.descripcion !== null) {
        polinUpdatePage.setDescripcionInput(polinSample.descripcion);
      }
      if (polinSample.tipoPolin !== undefined && polinSample.tipoPolin !== null) {
        polinUpdatePage.setTipoPolinInput(polinSample.tipoPolin);
      }
      if (polinSample.estado !== undefined && polinSample.estado !== null) {
        polinUpdatePage.setEstadoInput(polinSample.estado);
      }
      polinUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        polin = body;
      });

      polinComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
