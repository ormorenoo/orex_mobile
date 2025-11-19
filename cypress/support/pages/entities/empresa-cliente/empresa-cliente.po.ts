import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class EmpresaClienteComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-empresa-cliente';
}

export class EmpresaClienteUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-empresa-cliente-update';

  setRutInput(rut: string) {
    this.setInputValue('rut', rut);
  }

  setRazonSocialInput(razonSocial: string) {
    this.setInputValue('razonSocial', razonSocial);
  }

  setDireccionInput(direccion: string) {
    this.setInputValue('direccion', direccion);
  }

  setTelefonoInput(telefono: string) {
    this.setInputValue('telefono', telefono);
  }

  setNombreContactoInput(nombreContacto: string) {
    this.setInputValue('nombreContacto', nombreContacto);
  }

  setCorreoInput(correo: string) {
    this.setInputValue('correo', correo);
  }
}

export class EmpresaClienteDetailPage extends EntityDetailPage {
  pageSelector = 'page-empresa-cliente-detail';

  getRutContent() {
    return cy.get('#rut-content');
  }

  getRazonSocialContent() {
    return cy.get('#razonSocial-content');
  }

  getDireccionContent() {
    return cy.get('#direccion-content');
  }

  getTelefonoContent() {
    return cy.get('#telefono-content');
  }

  getNombreContactoContent() {
    return cy.get('#nombreContacto-content');
  }

  getCorreoContent() {
    return cy.get('#correo-content');
  }
}
