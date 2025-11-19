import { USER_PASSWORD, USER_USERNAME } from '../../../support/config';
import {
  MesaTrabajoComponentsPage,
  MesaTrabajoDetailPage,
  MesaTrabajoUpdatePage,
} from '../../../support/pages/entities/mesa-trabajo/mesa-trabajo.po';
import mesaTrabajoSample from './mesa-trabajo.json';

describe('MesaTrabajo entity', () => {
  const COMPONENT_TITLE = 'Mesa Trabajos';
  const SUBCOMPONENT_TITLE = 'Mesa Trabajo';

  const mesaTrabajoPageUrl = '/tabs/entities/mesa-trabajo';
  const mesaTrabajoApiUrl = '/api/mesa-trabajos';

  const mesaTrabajoComponentsPage = new MesaTrabajoComponentsPage();
  const mesaTrabajoUpdatePage = new MesaTrabajoUpdatePage();
  const mesaTrabajoDetailPage = new MesaTrabajoDetailPage();

  let mesaTrabajo: any;

  beforeEach(() => {
    mesaTrabajo = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load MesaTrabajos page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      mesaTrabajoComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', mesaTrabajoPageUrl);

      mesaTrabajoComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create MesaTrabajo page and go back', () => {
      cy.visit(mesaTrabajoPageUrl);
      mesaTrabajoComponentsPage.clickOnCreateButton();

      mesaTrabajoUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      mesaTrabajoUpdatePage.back();
      cy.url().should('include', mesaTrabajoPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: mesaTrabajoApiUrl,
        body: mesaTrabajoSample,
      }).then(({ body }) => {
        mesaTrabajo = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${mesaTrabajoApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [mesaTrabajo],
          },
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (mesaTrabajo) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${mesaTrabajoApiUrl}/${mesaTrabajo.id}`,
        }).then(() => {
          mesaTrabajo = undefined;
        });
      }
    });

    it('should open MesaTrabajo view, open MesaTrabajo edit and go back', () => {
      cy.visit(mesaTrabajoPageUrl);
      mesaTrabajoComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      mesaTrabajoDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (mesaTrabajo.identificador !== undefined && mesaTrabajo.identificador !== null) {
        mesaTrabajoDetailPage.getIdentificadorContent().contains(mesaTrabajo.identificador);
      }
      if (mesaTrabajo.descripcion !== undefined && mesaTrabajo.descripcion !== null) {
        mesaTrabajoDetailPage.getDescripcionContent().contains(mesaTrabajo.descripcion);
      }
      mesaTrabajoDetailPage.edit();

      mesaTrabajoUpdatePage.back();
      mesaTrabajoDetailPage.back();
      cy.url().should('include', mesaTrabajoPageUrl);
    });

    it('should open MesaTrabajo view, open MesaTrabajo edit and save', () => {
      cy.visit(mesaTrabajoPageUrl);
      mesaTrabajoComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      mesaTrabajoDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      mesaTrabajoDetailPage.edit();

      mesaTrabajoUpdatePage.save();
      cy.url().should('include', mesaTrabajoPageUrl);
    });

    it('should delete MesaTrabajo', () => {
      cy.visit(mesaTrabajoPageUrl);
      mesaTrabajoComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      mesaTrabajoDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      mesaTrabajoComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      mesaTrabajo = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: mesaTrabajoApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (mesaTrabajo) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${mesaTrabajoApiUrl}/${mesaTrabajo.id}`,
        }).then(() => {
          mesaTrabajo = undefined;
        });
      }
    });

    it('should create MesaTrabajo', () => {
      cy.visit(`${mesaTrabajoPageUrl}/new`);

      mesaTrabajoUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (mesaTrabajoSample.identificador !== undefined && mesaTrabajoSample.identificador !== null) {
        mesaTrabajoUpdatePage.setIdentificadorInput(mesaTrabajoSample.identificador);
      }
      if (mesaTrabajoSample.descripcion !== undefined && mesaTrabajoSample.descripcion !== null) {
        mesaTrabajoUpdatePage.setDescripcionInput(mesaTrabajoSample.descripcion);
      }
      if (mesaTrabajoSample.tipo !== undefined && mesaTrabajoSample.tipo !== null) {
        mesaTrabajoUpdatePage.setTipoInput(mesaTrabajoSample.tipo);
      }
      mesaTrabajoUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        mesaTrabajo = body;
      });

      mesaTrabajoComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
