import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class MesaTrabajoComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-mesa-trabajo';
}

export class MesaTrabajoUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-mesa-trabajo-update';

  setIdentificadorInput(identificador: string) {
    this.setInputValue('identificador', identificador);
  }

  setDescripcionInput(descripcion: string) {
    this.setInputValue('descripcion', descripcion);
  }

  setTipoInput(tipo: string) {
    this.select('tipo', tipo);
  }
}

export class MesaTrabajoDetailPage extends EntityDetailPage {
  pageSelector = 'page-mesa-trabajo-detail';

  getIdentificadorContent() {
    return cy.get('#identificador-content');
  }

  getDescripcionContent() {
    return cy.get('#descripcion-content');
  }

  getTipoContent() {
    return cy.get('#tipo-content');
  }
}
