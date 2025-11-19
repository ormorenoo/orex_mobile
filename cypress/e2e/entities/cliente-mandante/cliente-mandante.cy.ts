import { USER_PASSWORD, USER_USERNAME } from '../../../support/config';
import {
  ClienteMandanteComponentsPage,
  ClienteMandanteDetailPage,
  ClienteMandanteUpdatePage,
} from '../../../support/pages/entities/cliente-mandante/cliente-mandante.po';
import clienteMandanteSample from './cliente-mandante.json';

describe('ClienteMandante entity', () => {
  const COMPONENT_TITLE = 'Cliente Mandantes';
  const SUBCOMPONENT_TITLE = 'Cliente Mandante';

  const clienteMandantePageUrl = '/tabs/entities/cliente-mandante';
  const clienteMandanteApiUrl = '/api/cliente-mandantes';

  const clienteMandanteComponentsPage = new ClienteMandanteComponentsPage();
  const clienteMandanteUpdatePage = new ClienteMandanteUpdatePage();
  const clienteMandanteDetailPage = new ClienteMandanteDetailPage();

  let clienteMandante: any;

  beforeEach(() => {
    clienteMandante = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load ClienteMandantes page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      clienteMandanteComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', clienteMandantePageUrl);

      clienteMandanteComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create ClienteMandante page and go back', () => {
      cy.visit(clienteMandantePageUrl);
      clienteMandanteComponentsPage.clickOnCreateButton();

      clienteMandanteUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      clienteMandanteUpdatePage.back();
      cy.url().should('include', clienteMandantePageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: clienteMandanteApiUrl,
        body: clienteMandanteSample,
      }).then(({ body }) => {
        clienteMandante = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${clienteMandanteApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [clienteMandante],
          },
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (clienteMandante) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${clienteMandanteApiUrl}/${clienteMandante.id}`,
        }).then(() => {
          clienteMandante = undefined;
        });
      }
    });

    it('should open ClienteMandante view, open ClienteMandante edit and go back', () => {
      cy.visit(clienteMandantePageUrl);
      clienteMandanteComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      clienteMandanteDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (clienteMandante.rut !== undefined && clienteMandante.rut !== null) {
        clienteMandanteDetailPage.getRutContent().contains(clienteMandante.rut);
      }
      if (clienteMandante.razonSocial !== undefined && clienteMandante.razonSocial !== null) {
        clienteMandanteDetailPage.getRazonSocialContent().contains(clienteMandante.razonSocial);
      }
      if (clienteMandante.direccion !== undefined && clienteMandante.direccion !== null) {
        clienteMandanteDetailPage.getDireccionContent().contains(clienteMandante.direccion);
      }
      if (clienteMandante.nombreContacto !== undefined && clienteMandante.nombreContacto !== null) {
        clienteMandanteDetailPage.getNombreContactoContent().contains(clienteMandante.nombreContacto);
      }
      if (clienteMandante.telefono !== undefined && clienteMandante.telefono !== null) {
        clienteMandanteDetailPage.getTelefonoContent().contains(clienteMandante.telefono);
      }
      if (clienteMandante.correo !== undefined && clienteMandante.correo !== null) {
        clienteMandanteDetailPage.getCorreoContent().contains(clienteMandante.correo);
      }
      clienteMandanteDetailPage.edit();

      clienteMandanteUpdatePage.back();
      clienteMandanteDetailPage.back();
      cy.url().should('include', clienteMandantePageUrl);
    });

    it('should open ClienteMandante view, open ClienteMandante edit and save', () => {
      cy.visit(clienteMandantePageUrl);
      clienteMandanteComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      clienteMandanteDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      clienteMandanteDetailPage.edit();

      clienteMandanteUpdatePage.save();
      cy.url().should('include', clienteMandantePageUrl);
    });

    it('should delete ClienteMandante', () => {
      cy.visit(clienteMandantePageUrl);
      clienteMandanteComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      clienteMandanteDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      clienteMandanteComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      clienteMandante = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: clienteMandanteApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (clienteMandante) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${clienteMandanteApiUrl}/${clienteMandante.id}`,
        }).then(() => {
          clienteMandante = undefined;
        });
      }
    });

    it('should create ClienteMandante', () => {
      cy.visit(`${clienteMandantePageUrl}/new`);

      clienteMandanteUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (clienteMandanteSample.rut !== undefined && clienteMandanteSample.rut !== null) {
        clienteMandanteUpdatePage.setRutInput(clienteMandanteSample.rut);
      }
      if (clienteMandanteSample.razonSocial !== undefined && clienteMandanteSample.razonSocial !== null) {
        clienteMandanteUpdatePage.setRazonSocialInput(clienteMandanteSample.razonSocial);
      }
      if (clienteMandanteSample.direccion !== undefined && clienteMandanteSample.direccion !== null) {
        clienteMandanteUpdatePage.setDireccionInput(clienteMandanteSample.direccion);
      }
      if (clienteMandanteSample.nombreContacto !== undefined && clienteMandanteSample.nombreContacto !== null) {
        clienteMandanteUpdatePage.setNombreContactoInput(clienteMandanteSample.nombreContacto);
      }
      if (clienteMandanteSample.telefono !== undefined && clienteMandanteSample.telefono !== null) {
        clienteMandanteUpdatePage.setTelefonoInput(clienteMandanteSample.telefono);
      }
      if (clienteMandanteSample.correo !== undefined && clienteMandanteSample.correo !== null) {
        clienteMandanteUpdatePage.setCorreoInput(clienteMandanteSample.correo);
      }
      clienteMandanteUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        clienteMandante = body;
      });

      clienteMandanteComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
