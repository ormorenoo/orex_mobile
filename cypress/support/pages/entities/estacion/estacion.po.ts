import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class EstacionComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-estacion';
}

export class EstacionUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-estacion-update';

  setIdentificadorInput(identificador: string) {
    this.setInputValue('identificador', identificador);
  }

  setDescripcionInput(descripcion: string) {
    this.setInputValue('descripcion', descripcion);
  }

  setTipoEstacionInput(tipoEstacion: string) {
    this.select('tipoEstacion', tipoEstacion);
  }

  setTipoEstacionPolinInput(tipoEstacionPolin: string) {
    this.select('tipoEstacionPolin', tipoEstacionPolin);
  }

  setEstadoInput(estado: string) {
    this.select('estado', estado);
  }
}

export class EstacionDetailPage extends EntityDetailPage {
  pageSelector = 'page-estacion-detail';

  getIdentificadorContent() {
    return cy.get('#identificador-content');
  }

  getDescripcionContent() {
    return cy.get('#descripcion-content');
  }

  getTipoEstacionContent() {
    return cy.get('#tipoEstacion-content');
  }

  getTipoEstacionPolinContent() {
    return cy.get('#tipoEstacionPolin-content');
  }

  getEstadoContent() {
    return cy.get('#estado-content');
  }
}
