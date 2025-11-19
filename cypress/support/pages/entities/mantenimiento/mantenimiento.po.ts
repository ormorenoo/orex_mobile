import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class MantenimientoComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-mantenimiento';
}

export class MantenimientoUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-mantenimiento-update';

  setFechaCreacionInput(fechaCreacion: string) {
    this.setDateTime('fechaCreacion', fechaCreacion);
  }

  setCondicionPolinInput(condicionPolin: string) {
    this.select('condicionPolin', condicionPolin);
  }

  setRutaFotoGeneralInput(rutaFotoGeneral: string) {
    this.setInputValue('rutaFotoGeneral', rutaFotoGeneral);
  }

  setRutaFotoDetallePolinInput(rutaFotoDetallePolin: string) {
    this.setInputValue('rutaFotoDetallePolin', rutaFotoDetallePolin);
  }
}

export class MantenimientoDetailPage extends EntityDetailPage {
  pageSelector = 'page-mantenimiento-detail';

  getFechaCreacionContent() {
    return cy.get('#fechaCreacion-content');
  }

  getCondicionPolinContent() {
    return cy.get('#condicionPolin-content');
  }

  getRutaFotoGeneralContent() {
    return cy.get('#rutaFotoGeneral-content');
  }

  getRutaFotoDetallePolinContent() {
    return cy.get('#rutaFotoDetallePolin-content');
  }
}
