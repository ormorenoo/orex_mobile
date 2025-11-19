import { USER_PASSWORD, USER_USERNAME } from '../../../support/config';
import { AreaComponentsPage, AreaDetailPage, AreaUpdatePage } from '../../../support/pages/entities/area/area.po';
import areaSample from './area.json';

describe('Area entity', () => {
  const COMPONENT_TITLE = 'Areas';
  const SUBCOMPONENT_TITLE = 'Area';

  const areaPageUrl = '/tabs/entities/area';
  const areaApiUrl = '/api/areas';

  const areaComponentsPage = new AreaComponentsPage();
  const areaUpdatePage = new AreaUpdatePage();
  const areaDetailPage = new AreaDetailPage();

  let area: any;

  beforeEach(() => {
    area = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load Areas page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      areaComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', areaPageUrl);

      areaComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create Area page and go back', () => {
      cy.visit(areaPageUrl);
      areaComponentsPage.clickOnCreateButton();

      areaUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      areaUpdatePage.back();
      cy.url().should('include', areaPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: areaApiUrl,
        body: areaSample,
      }).then(({ body }) => {
        area = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${areaApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [area],
          },
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (area) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${areaApiUrl}/${area.id}`,
        }).then(() => {
          area = undefined;
        });
      }
    });

    it('should open Area view, open Area edit and go back', () => {
      cy.visit(areaPageUrl);
      areaComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      areaDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (area.nombre !== undefined && area.nombre !== null) {
        areaDetailPage.getNombreContent().contains(area.nombre);
      }
      areaDetailPage.edit();

      areaUpdatePage.back();
      areaDetailPage.back();
      cy.url().should('include', areaPageUrl);
    });

    it('should open Area view, open Area edit and save', () => {
      cy.visit(areaPageUrl);
      areaComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      areaDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      areaDetailPage.edit();

      areaUpdatePage.save();
      cy.url().should('include', areaPageUrl);
    });

    it('should delete Area', () => {
      cy.visit(areaPageUrl);
      areaComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      areaDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      areaComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      area = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: areaApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (area) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${areaApiUrl}/${area.id}`,
        }).then(() => {
          area = undefined;
        });
      }
    });

    it('should create Area', () => {
      cy.visit(`${areaPageUrl}/new`);

      areaUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (areaSample.nombre !== undefined && areaSample.nombre !== null) {
        areaUpdatePage.setNombreInput(areaSample.nombre);
      }
      areaUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        area = body;
      });

      areaComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
