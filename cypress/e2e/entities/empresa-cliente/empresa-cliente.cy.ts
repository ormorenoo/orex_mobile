import { USER_PASSWORD, USER_USERNAME } from '../../../support/config';
import {
  EmpresaClienteComponentsPage,
  EmpresaClienteDetailPage,
  EmpresaClienteUpdatePage,
} from '../../../support/pages/entities/empresa-cliente/empresa-cliente.po';
import empresaClienteSample from './empresa-cliente.json';

describe('EmpresaCliente entity', () => {
  const COMPONENT_TITLE = 'Empresa Clientes';
  const SUBCOMPONENT_TITLE = 'Empresa Cliente';

  const empresaClientePageUrl = '/tabs/entities/empresa-cliente';
  const empresaClienteApiUrl = '/api/empresa-clientes';

  const empresaClienteComponentsPage = new EmpresaClienteComponentsPage();
  const empresaClienteUpdatePage = new EmpresaClienteUpdatePage();
  const empresaClienteDetailPage = new EmpresaClienteDetailPage();

  let empresaCliente: any;

  beforeEach(() => {
    empresaCliente = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load EmpresaClientes page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      empresaClienteComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', empresaClientePageUrl);

      empresaClienteComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create EmpresaCliente page and go back', () => {
      cy.visit(empresaClientePageUrl);
      empresaClienteComponentsPage.clickOnCreateButton();

      empresaClienteUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      empresaClienteUpdatePage.back();
      cy.url().should('include', empresaClientePageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: empresaClienteApiUrl,
        body: empresaClienteSample,
      }).then(({ body }) => {
        empresaCliente = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${empresaClienteApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [empresaCliente],
          },
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (empresaCliente) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${empresaClienteApiUrl}/${empresaCliente.id}`,
        }).then(() => {
          empresaCliente = undefined;
        });
      }
    });

    it('should open EmpresaCliente view, open EmpresaCliente edit and go back', () => {
      cy.visit(empresaClientePageUrl);
      empresaClienteComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      empresaClienteDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (empresaCliente.rut !== undefined && empresaCliente.rut !== null) {
        empresaClienteDetailPage.getRutContent().contains(empresaCliente.rut);
      }
      if (empresaCliente.razonSocial !== undefined && empresaCliente.razonSocial !== null) {
        empresaClienteDetailPage.getRazonSocialContent().contains(empresaCliente.razonSocial);
      }
      if (empresaCliente.direccion !== undefined && empresaCliente.direccion !== null) {
        empresaClienteDetailPage.getDireccionContent().contains(empresaCliente.direccion);
      }
      if (empresaCliente.telefono !== undefined && empresaCliente.telefono !== null) {
        empresaClienteDetailPage.getTelefonoContent().contains(empresaCliente.telefono);
      }
      if (empresaCliente.nombreContacto !== undefined && empresaCliente.nombreContacto !== null) {
        empresaClienteDetailPage.getNombreContactoContent().contains(empresaCliente.nombreContacto);
      }
      if (empresaCliente.correo !== undefined && empresaCliente.correo !== null) {
        empresaClienteDetailPage.getCorreoContent().contains(empresaCliente.correo);
      }
      empresaClienteDetailPage.edit();

      empresaClienteUpdatePage.back();
      empresaClienteDetailPage.back();
      cy.url().should('include', empresaClientePageUrl);
    });

    it('should open EmpresaCliente view, open EmpresaCliente edit and save', () => {
      cy.visit(empresaClientePageUrl);
      empresaClienteComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      empresaClienteDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      empresaClienteDetailPage.edit();

      empresaClienteUpdatePage.save();
      cy.url().should('include', empresaClientePageUrl);
    });

    it('should delete EmpresaCliente', () => {
      cy.visit(empresaClientePageUrl);
      empresaClienteComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      empresaClienteDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      empresaClienteComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      empresaCliente = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: empresaClienteApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (empresaCliente) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${empresaClienteApiUrl}/${empresaCliente.id}`,
        }).then(() => {
          empresaCliente = undefined;
        });
      }
    });

    it('should create EmpresaCliente', () => {
      cy.visit(`${empresaClientePageUrl}/new`);

      empresaClienteUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (empresaClienteSample.rut !== undefined && empresaClienteSample.rut !== null) {
        empresaClienteUpdatePage.setRutInput(empresaClienteSample.rut);
      }
      if (empresaClienteSample.razonSocial !== undefined && empresaClienteSample.razonSocial !== null) {
        empresaClienteUpdatePage.setRazonSocialInput(empresaClienteSample.razonSocial);
      }
      if (empresaClienteSample.direccion !== undefined && empresaClienteSample.direccion !== null) {
        empresaClienteUpdatePage.setDireccionInput(empresaClienteSample.direccion);
      }
      if (empresaClienteSample.telefono !== undefined && empresaClienteSample.telefono !== null) {
        empresaClienteUpdatePage.setTelefonoInput(empresaClienteSample.telefono);
      }
      if (empresaClienteSample.nombreContacto !== undefined && empresaClienteSample.nombreContacto !== null) {
        empresaClienteUpdatePage.setNombreContactoInput(empresaClienteSample.nombreContacto);
      }
      if (empresaClienteSample.correo !== undefined && empresaClienteSample.correo !== null) {
        empresaClienteUpdatePage.setCorreoInput(empresaClienteSample.correo);
      }
      empresaClienteUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        empresaCliente = body;
      });

      empresaClienteComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
