import { USER_PASSWORD, USER_USERNAME } from '../../../support/config';
import {
  InspeccionComponentsPage,
  InspeccionDetailPage,
  InspeccionUpdatePage,
} from '../../../support/pages/entities/inspeccion/inspeccion.po';
import inspeccionSample from './inspeccion.json';

describe('Inspeccion entity', () => {
  const COMPONENT_TITLE = 'Inspeccions';
  const SUBCOMPONENT_TITLE = 'Inspeccion';

  const inspeccionPageUrl = '/tabs/entities/inspeccion';
  const inspeccionApiUrl = '/api/inspeccions';

  const inspeccionComponentsPage = new InspeccionComponentsPage();
  const inspeccionUpdatePage = new InspeccionUpdatePage();
  const inspeccionDetailPage = new InspeccionDetailPage();

  let inspeccion: any;

  beforeEach(() => {
    inspeccion = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load Inspeccions page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      inspeccionComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', inspeccionPageUrl);

      inspeccionComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create Inspeccion page and go back', () => {
      cy.visit(inspeccionPageUrl);
      inspeccionComponentsPage.clickOnCreateButton();

      inspeccionUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      inspeccionUpdatePage.back();
      cy.url().should('include', inspeccionPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: inspeccionApiUrl,
        body: inspeccionSample,
      }).then(({ body }) => {
        inspeccion = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${inspeccionApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [inspeccion],
          },
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (inspeccion) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${inspeccionApiUrl}/${inspeccion.id}`,
        }).then(() => {
          inspeccion = undefined;
        });
      }
    });

    it('should open Inspeccion view, open Inspeccion edit and go back', () => {
      cy.visit(inspeccionPageUrl);
      inspeccionComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      inspeccionDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (inspeccion.comentarios !== undefined && inspeccion.comentarios !== null) {
        inspeccionDetailPage.getComentariosContent().contains(inspeccion.comentarios);
      }
      if (inspeccion.rutaFotoGeneral !== undefined && inspeccion.rutaFotoGeneral !== null) {
        inspeccionDetailPage.getRutaFotoGeneralContent().contains(inspeccion.rutaFotoGeneral);
      }
      if (inspeccion.rutaFotoDetallePolin !== undefined && inspeccion.rutaFotoDetallePolin !== null) {
        inspeccionDetailPage.getRutaFotoDetallePolinContent().contains(inspeccion.rutaFotoDetallePolin);
      }
      inspeccionDetailPage.edit();

      inspeccionUpdatePage.back();
      inspeccionDetailPage.back();
      cy.url().should('include', inspeccionPageUrl);
    });

    it('should open Inspeccion view, open Inspeccion edit and save', () => {
      cy.visit(inspeccionPageUrl);
      inspeccionComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      inspeccionDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      inspeccionDetailPage.edit();

      inspeccionUpdatePage.save();
      cy.url().should('include', inspeccionPageUrl);
    });

    it('should delete Inspeccion', () => {
      cy.visit(inspeccionPageUrl);
      inspeccionComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      inspeccionDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      inspeccionComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      inspeccion = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: inspeccionApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (inspeccion) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${inspeccionApiUrl}/${inspeccion.id}`,
        }).then(() => {
          inspeccion = undefined;
        });
      }
    });

    it('should create Inspeccion', () => {
      cy.visit(`${inspeccionPageUrl}/new`);

      inspeccionUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (inspeccionSample.fechaCreacion !== undefined && inspeccionSample.fechaCreacion !== null) {
        inspeccionUpdatePage.setFechaCreacionInput(inspeccionSample.fechaCreacion);
      }
      if (inspeccionSample.condicionPolin !== undefined && inspeccionSample.condicionPolin !== null) {
        inspeccionUpdatePage.setCondicionPolinInput(inspeccionSample.condicionPolin);
      }
      if (inspeccionSample.criticidad !== undefined && inspeccionSample.criticidad !== null) {
        inspeccionUpdatePage.setCriticidadInput(inspeccionSample.criticidad);
      }
      if (inspeccionSample.observacion !== undefined && inspeccionSample.observacion !== null) {
        inspeccionUpdatePage.setObservacionInput(inspeccionSample.observacion);
      }
      if (inspeccionSample.comentarios !== undefined && inspeccionSample.comentarios !== null) {
        inspeccionUpdatePage.setComentariosInput(inspeccionSample.comentarios);
      }
      if (inspeccionSample.rutaFotoGeneral !== undefined && inspeccionSample.rutaFotoGeneral !== null) {
        inspeccionUpdatePage.setRutaFotoGeneralInput(inspeccionSample.rutaFotoGeneral);
      }
      if (inspeccionSample.rutaFotoDetallePolin !== undefined && inspeccionSample.rutaFotoDetallePolin !== null) {
        inspeccionUpdatePage.setRutaFotoDetallePolinInput(inspeccionSample.rutaFotoDetallePolin);
      }
      inspeccionUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        inspeccion = body;
      });

      inspeccionComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
