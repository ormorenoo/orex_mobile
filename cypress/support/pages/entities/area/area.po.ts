import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class AreaComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-area';
}

export class AreaUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-area-update';

  setNombreInput(nombre: string) {
    this.setInputValue('nombre', nombre);
  }
}

export class AreaDetailPage extends EntityDetailPage {
  pageSelector = 'page-area-detail';

  getNombreContent() {
    return cy.get('#nombre-content');
  }
}
