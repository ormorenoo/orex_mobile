import { USER_PASSWORD, USER_USERNAME } from '../../../support/config';
import {
  MantenimientoComponentsPage,
  MantenimientoDetailPage,
  MantenimientoUpdatePage,
} from '../../../support/pages/entities/mantenimiento/mantenimiento.po';
import mantenimientoSample from './mantenimiento.json';

describe('Mantenimiento entity', () => {
  const COMPONENT_TITLE = 'Mantenimientos';
  const SUBCOMPONENT_TITLE = 'Mantenimiento';

  const mantenimientoPageUrl = '/tabs/entities/mantenimiento';
  const mantenimientoApiUrl = '/api/mantenimientos';

  const mantenimientoComponentsPage = new MantenimientoComponentsPage();
  const mantenimientoUpdatePage = new MantenimientoUpdatePage();
  const mantenimientoDetailPage = new MantenimientoDetailPage();

  let mantenimiento: any;

  beforeEach(() => {
    mantenimiento = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load Mantenimientos page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      mantenimientoComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', mantenimientoPageUrl);

      mantenimientoComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create Mantenimiento page and go back', () => {
      cy.visit(mantenimientoPageUrl);
      mantenimientoComponentsPage.clickOnCreateButton();

      mantenimientoUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      mantenimientoUpdatePage.back();
      cy.url().should('include', mantenimientoPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: mantenimientoApiUrl,
        body: mantenimientoSample,
      }).then(({ body }) => {
        mantenimiento = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${mantenimientoApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [mantenimiento],
          },
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (mantenimiento) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${mantenimientoApiUrl}/${mantenimiento.id}`,
        }).then(() => {
          mantenimiento = undefined;
        });
      }
    });

    it('should open Mantenimiento view, open Mantenimiento edit and go back', () => {
      cy.visit(mantenimientoPageUrl);
      mantenimientoComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      mantenimientoDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (mantenimiento.rutaFotoGeneral !== undefined && mantenimiento.rutaFotoGeneral !== null) {
        mantenimientoDetailPage.getRutaFotoGeneralContent().contains(mantenimiento.rutaFotoGeneral);
      }
      if (mantenimiento.rutaFotoDetallePolin !== undefined && mantenimiento.rutaFotoDetallePolin !== null) {
        mantenimientoDetailPage.getRutaFotoDetallePolinContent().contains(mantenimiento.rutaFotoDetallePolin);
      }
      mantenimientoDetailPage.edit();

      mantenimientoUpdatePage.back();
      mantenimientoDetailPage.back();
      cy.url().should('include', mantenimientoPageUrl);
    });

    it('should open Mantenimiento view, open Mantenimiento edit and save', () => {
      cy.visit(mantenimientoPageUrl);
      mantenimientoComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      mantenimientoDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      mantenimientoDetailPage.edit();

      mantenimientoUpdatePage.save();
      cy.url().should('include', mantenimientoPageUrl);
    });

    it('should delete Mantenimiento', () => {
      cy.visit(mantenimientoPageUrl);
      mantenimientoComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      mantenimientoDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      mantenimientoComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      mantenimiento = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: mantenimientoApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (mantenimiento) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${mantenimientoApiUrl}/${mantenimiento.id}`,
        }).then(() => {
          mantenimiento = undefined;
        });
      }
    });

    it('should create Mantenimiento', () => {
      cy.visit(`${mantenimientoPageUrl}/new`);

      mantenimientoUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (mantenimientoSample.fechaCreacion !== undefined && mantenimientoSample.fechaCreacion !== null) {
        mantenimientoUpdatePage.setFechaCreacionInput(mantenimientoSample.fechaCreacion);
      }
      if (mantenimientoSample.condicionPolin !== undefined && mantenimientoSample.condicionPolin !== null) {
        mantenimientoUpdatePage.setCondicionPolinInput(mantenimientoSample.condicionPolin);
      }
      if (mantenimientoSample.rutaFotoGeneral !== undefined && mantenimientoSample.rutaFotoGeneral !== null) {
        mantenimientoUpdatePage.setRutaFotoGeneralInput(mantenimientoSample.rutaFotoGeneral);
      }
      if (mantenimientoSample.rutaFotoDetallePolin !== undefined && mantenimientoSample.rutaFotoDetallePolin !== null) {
        mantenimientoUpdatePage.setRutaFotoDetallePolinInput(mantenimientoSample.rutaFotoDetallePolin);
      }
      mantenimientoUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        mantenimiento = body;
      });

      mantenimientoComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
