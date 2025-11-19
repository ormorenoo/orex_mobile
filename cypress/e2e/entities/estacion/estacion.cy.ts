import { USER_PASSWORD, USER_USERNAME } from '../../../support/config';
import { EstacionComponentsPage, EstacionDetailPage, EstacionUpdatePage } from '../../../support/pages/entities/estacion/estacion.po';
import estacionSample from './estacion.json';

describe('Estacion entity', () => {
  const COMPONENT_TITLE = 'Estacions';
  const SUBCOMPONENT_TITLE = 'Estacion';

  const estacionPageUrl = '/tabs/entities/estacion';
  const estacionApiUrl = '/api/estacions';

  const estacionComponentsPage = new EstacionComponentsPage();
  const estacionUpdatePage = new EstacionUpdatePage();
  const estacionDetailPage = new EstacionDetailPage();

  let estacion: any;

  beforeEach(() => {
    estacion = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load Estacions page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      estacionComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', estacionPageUrl);

      estacionComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create Estacion page and go back', () => {
      cy.visit(estacionPageUrl);
      estacionComponentsPage.clickOnCreateButton();

      estacionUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      estacionUpdatePage.back();
      cy.url().should('include', estacionPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: estacionApiUrl,
        body: estacionSample,
      }).then(({ body }) => {
        estacion = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${estacionApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [estacion],
          },
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (estacion) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${estacionApiUrl}/${estacion.id}`,
        }).then(() => {
          estacion = undefined;
        });
      }
    });

    it('should open Estacion view, open Estacion edit and go back', () => {
      cy.visit(estacionPageUrl);
      estacionComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      estacionDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (estacion.identificador !== undefined && estacion.identificador !== null) {
        estacionDetailPage.getIdentificadorContent().contains(estacion.identificador);
      }
      if (estacion.descripcion !== undefined && estacion.descripcion !== null) {
        estacionDetailPage.getDescripcionContent().contains(estacion.descripcion);
      }
      estacionDetailPage.edit();

      estacionUpdatePage.back();
      estacionDetailPage.back();
      cy.url().should('include', estacionPageUrl);
    });

    it('should open Estacion view, open Estacion edit and save', () => {
      cy.visit(estacionPageUrl);
      estacionComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      estacionDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      estacionDetailPage.edit();

      estacionUpdatePage.save();
      cy.url().should('include', estacionPageUrl);
    });

    it('should delete Estacion', () => {
      cy.visit(estacionPageUrl);
      estacionComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      estacionDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      estacionComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      estacion = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: estacionApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (estacion) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${estacionApiUrl}/${estacion.id}`,
        }).then(() => {
          estacion = undefined;
        });
      }
    });

    it('should create Estacion', () => {
      cy.visit(`${estacionPageUrl}/new`);

      estacionUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (estacionSample.identificador !== undefined && estacionSample.identificador !== null) {
        estacionUpdatePage.setIdentificadorInput(estacionSample.identificador);
      }
      if (estacionSample.descripcion !== undefined && estacionSample.descripcion !== null) {
        estacionUpdatePage.setDescripcionInput(estacionSample.descripcion);
      }
      if (estacionSample.tipoEstacion !== undefined && estacionSample.tipoEstacion !== null) {
        estacionUpdatePage.setTipoEstacionInput(estacionSample.tipoEstacion);
      }
      if (estacionSample.tipoEstacionPolin !== undefined && estacionSample.tipoEstacionPolin !== null) {
        estacionUpdatePage.setTipoEstacionPolinInput(estacionSample.tipoEstacionPolin);
      }
      if (estacionSample.estado !== undefined && estacionSample.estado !== null) {
        estacionUpdatePage.setEstadoInput(estacionSample.estado);
      }
      estacionUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        estacion = body;
      });

      estacionComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
