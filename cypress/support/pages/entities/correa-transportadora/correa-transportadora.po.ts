import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class CorreaTransportadoraComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-correa-transportadora';
}

export class CorreaTransportadoraUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-correa-transportadora-update';

  setTagIdInput(tagId: string) {
    this.setInputValue('tagId', tagId);
  }

  setDescripcionInput(descripcion: string) {
    this.setInputValue('descripcion', descripcion);
  }
}

export class CorreaTransportadoraDetailPage extends EntityDetailPage {
  pageSelector = 'page-correa-transportadora-detail';

  getTagIdContent() {
    return cy.get('#tagId-content');
  }

  getDescripcionContent() {
    return cy.get('#descripcion-content');
  }
}
