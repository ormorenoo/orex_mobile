import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class PolinComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-polin';
}

export class PolinUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-polin-update';

  setIdentificadorInput(identificador: string) {
    this.setInputValue('identificador', identificador);
  }

  setDescripcionInput(descripcion: string) {
    this.setInputValue('descripcion', descripcion);
  }

  setTipoPolinInput(tipoPolin: string) {
    this.select('tipoPolin', tipoPolin);
  }

  setEstadoInput(estado: string) {
    this.select('estado', estado);
  }
}

export class PolinDetailPage extends EntityDetailPage {
  pageSelector = 'page-polin-detail';

  getIdentificadorContent() {
    return cy.get('#identificador-content');
  }

  getDescripcionContent() {
    return cy.get('#descripcion-content');
  }

  getTipoPolinContent() {
    return cy.get('#tipoPolin-content');
  }

  getEstadoContent() {
    return cy.get('#estado-content');
  }
}
