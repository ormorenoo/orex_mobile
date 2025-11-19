import { USER_PASSWORD, USER_USERNAME } from '../../../support/config';
import {
  CorreaTransportadoraComponentsPage,
  CorreaTransportadoraDetailPage,
  CorreaTransportadoraUpdatePage,
} from '../../../support/pages/entities/correa-transportadora/correa-transportadora.po';
import correaTransportadoraSample from './correa-transportadora.json';

describe('CorreaTransportadora entity', () => {
  const COMPONENT_TITLE = 'Correa Transportadoras';
  const SUBCOMPONENT_TITLE = 'Correa Transportadora';

  const correaTransportadoraPageUrl = '/tabs/entities/correa-transportadora';
  const correaTransportadoraApiUrl = '/api/correa-transportadoras';

  const correaTransportadoraComponentsPage = new CorreaTransportadoraComponentsPage();
  const correaTransportadoraUpdatePage = new CorreaTransportadoraUpdatePage();
  const correaTransportadoraDetailPage = new CorreaTransportadoraDetailPage();

  let correaTransportadora: any;

  beforeEach(() => {
    correaTransportadora = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load CorreaTransportadoras page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      correaTransportadoraComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', correaTransportadoraPageUrl);

      correaTransportadoraComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create CorreaTransportadora page and go back', () => {
      cy.visit(correaTransportadoraPageUrl);
      correaTransportadoraComponentsPage.clickOnCreateButton();

      correaTransportadoraUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      correaTransportadoraUpdatePage.back();
      cy.url().should('include', correaTransportadoraPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: correaTransportadoraApiUrl,
        body: correaTransportadoraSample,
      }).then(({ body }) => {
        correaTransportadora = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${correaTransportadoraApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [correaTransportadora],
          },
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (correaTransportadora) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${correaTransportadoraApiUrl}/${correaTransportadora.id}`,
        }).then(() => {
          correaTransportadora = undefined;
        });
      }
    });

    it('should open CorreaTransportadora view, open CorreaTransportadora edit and go back', () => {
      cy.visit(correaTransportadoraPageUrl);
      correaTransportadoraComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      correaTransportadoraDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (correaTransportadora.tagId !== undefined && correaTransportadora.tagId !== null) {
        correaTransportadoraDetailPage.getTagIdContent().contains(correaTransportadora.tagId);
      }
      if (correaTransportadora.descripcion !== undefined && correaTransportadora.descripcion !== null) {
        correaTransportadoraDetailPage.getDescripcionContent().contains(correaTransportadora.descripcion);
      }
      correaTransportadoraDetailPage.edit();

      correaTransportadoraUpdatePage.back();
      correaTransportadoraDetailPage.back();
      cy.url().should('include', correaTransportadoraPageUrl);
    });

    it('should open CorreaTransportadora view, open CorreaTransportadora edit and save', () => {
      cy.visit(correaTransportadoraPageUrl);
      correaTransportadoraComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      correaTransportadoraDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      correaTransportadoraDetailPage.edit();

      correaTransportadoraUpdatePage.save();
      cy.url().should('include', correaTransportadoraPageUrl);
    });

    it('should delete CorreaTransportadora', () => {
      cy.visit(correaTransportadoraPageUrl);
      correaTransportadoraComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      correaTransportadoraDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      correaTransportadoraComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      correaTransportadora = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: correaTransportadoraApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (correaTransportadora) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${correaTransportadoraApiUrl}/${correaTransportadora.id}`,
        }).then(() => {
          correaTransportadora = undefined;
        });
      }
    });

    it('should create CorreaTransportadora', () => {
      cy.visit(`${correaTransportadoraPageUrl}/new`);

      correaTransportadoraUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (correaTransportadoraSample.tagId !== undefined && correaTransportadoraSample.tagId !== null) {
        correaTransportadoraUpdatePage.setTagIdInput(correaTransportadoraSample.tagId);
      }
      if (correaTransportadoraSample.descripcion !== undefined && correaTransportadoraSample.descripcion !== null) {
        correaTransportadoraUpdatePage.setDescripcionInput(correaTransportadoraSample.descripcion);
      }
      correaTransportadoraUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        correaTransportadora = body;
      });

      correaTransportadoraComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
