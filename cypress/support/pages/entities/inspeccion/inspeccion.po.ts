import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class InspeccionComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-inspeccion';
}

export class InspeccionUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-inspeccion-update';

  setFechaCreacionInput(fechaCreacion: string) {
    this.setDateTime('fechaCreacion', fechaCreacion);
  }

  setCondicionPolinInput(condicionPolin: string) {
    this.select('condicionPolin', condicionPolin);
  }

  setCriticidadInput(criticidad: string) {
    this.select('criticidad', criticidad);
  }

  setObservacionInput(observacion: string) {
    this.select('observacion', observacion);
  }

  setComentariosInput(comentarios: string) {
    this.setInputValue('comentarios', comentarios);
  }

  setRutaFotoGeneralInput(rutaFotoGeneral: string) {
    this.setInputValue('rutaFotoGeneral', rutaFotoGeneral);
  }

  setRutaFotoDetallePolinInput(rutaFotoDetallePolin: string) {
    this.setInputValue('rutaFotoDetallePolin', rutaFotoDetallePolin);
  }
}

export class InspeccionDetailPage extends EntityDetailPage {
  pageSelector = 'page-inspeccion-detail';

  getFechaCreacionContent() {
    return cy.get('#fechaCreacion-content');
  }

  getCondicionPolinContent() {
    return cy.get('#condicionPolin-content');
  }

  getCriticidadContent() {
    return cy.get('#criticidad-content');
  }

  getObservacionContent() {
    return cy.get('#observacion-content');
  }

  getComentariosContent() {
    return cy.get('#comentarios-content');
  }

  getRutaFotoGeneralContent() {
    return cy.get('#rutaFotoGeneral-content');
  }

  getRutaFotoDetallePolinContent() {
    return cy.get('#rutaFotoDetallePolin-content');
  }
}
