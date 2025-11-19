import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class ClienteMandanteComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-cliente-mandante';
}

export class ClienteMandanteUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-cliente-mandante-update';

  setRutInput(rut: string) {
    this.setInputValue('rut', rut);
  }

  setRazonSocialInput(razonSocial: string) {
    this.setInputValue('razonSocial', razonSocial);
  }

  setDireccionInput(direccion: string) {
    this.setInputValue('direccion', direccion);
  }

  setNombreContactoInput(nombreContacto: string) {
    this.setInputValue('nombreContacto', nombreContacto);
  }

  setTelefonoInput(telefono: string) {
    this.setInputValue('telefono', telefono);
  }

  setCorreoInput(correo: string) {
    this.setInputValue('correo', correo);
  }
}

export class ClienteMandanteDetailPage extends EntityDetailPage {
  pageSelector = 'page-cliente-mandante-detail';

  getRutContent() {
    return cy.get('#rut-content');
  }

  getRazonSocialContent() {
    return cy.get('#razonSocial-content');
  }

  getDireccionContent() {
    return cy.get('#direccion-content');
  }

  getNombreContactoContent() {
    return cy.get('#nombreContacto-content');
  }

  getTelefonoContent() {
    return cy.get('#telefono-content');
  }

  getCorreoContent() {
    return cy.get('#correo-content');
  }
}
