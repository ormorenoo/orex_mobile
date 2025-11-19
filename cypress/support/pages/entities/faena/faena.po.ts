import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class FaenaComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-faena';
}

export class FaenaUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-faena-update';

  setNombreInput(nombre: string) {
    this.setInputValue('nombre', nombre);
  }
}

export class FaenaDetailPage extends EntityDetailPage {
  pageSelector = 'page-faena-detail';

  getNombreContent() {
    return cy.get('#nombre-content');
  }
}
