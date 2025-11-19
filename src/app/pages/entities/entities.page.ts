import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-entities',
  templateUrl: 'entities.page.html',
  styleUrls: ['entities.page.scss'],
})
export class EntitiesPage {
  entities: any[] = [
    { name: 'Empresa Cliente', component: 'EmpresaClientePage', route: 'empresa-cliente' },
    { name: 'Cliente Mandante', component: 'ClienteMandantePage', route: 'cliente-mandante' },
    { name: 'Faena', component: 'FaenaPage', route: 'faena' },
    { name: 'Area', component: 'AreaPage', route: 'area' },
    { name: 'Area Faena', component: 'AreaFaenaPage', route: 'area-faena' },
    { name: 'Correa Transportadora', component: 'CorreaTransportadoraPage', route: 'correa-transportadora' },
    { name: 'Mesa Trabajo', component: 'MesaTrabajoPage', route: 'mesa-trabajo' },
    { name: 'Estacion', component: 'EstacionPage', route: 'estacion' },
    { name: 'Polin', component: 'PolinPage', route: 'polin' },
    { name: 'Inspeccion', component: 'InspeccionPage', route: 'inspeccion' },
    { name: 'Mantenimiento', component: 'MantenimientoPage', route: 'mantenimiento' },
    /* jhipster-needle-add-entity-page - JHipster will add entity pages here */
  ];

  constructor(public navController: NavController) {}

  openPage(page) {
    this.navController.navigateForward(`/tabs/entities/${page.route}`);
  }
}
