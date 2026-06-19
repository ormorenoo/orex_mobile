import { Component, OnInit } from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Estacion } from '../estacion';
import { Polin } from '../polin';
import { MesaTrabajo } from './mesa-trabajo.model';
import { MesaTrabajoService } from './mesa-trabajo.service';
import { EstacionDataService } from '../estacion/estacion-data.service';
import { PolinDataService } from '../polin/polin-data.service';
import { estadoClase, estadoEstacion, ESTADO_SHORT, posicionLabel } from '#app/shared/utils/polin-ui.utils';

interface EstacionVista {
  estacion: Estacion;
  polines: Polin[];
  estado: string;
  estadoShort: string;
}

@Component({
  selector: 'page-mesa-trabajo-estaciones',
  templateUrl: 'mesa-trabajo-estaciones.html',
  styleUrl: 'mesa-trabajo-estaciones.scss',
})
export class MesaTrabajoEstacionesPage implements OnInit {
  mesaTrabajo: MesaTrabajo = {};
  estaciones: EstacionVista[] = [];
  cargando = false;

  estadoClase = estadoClase;
  posicionLabel = posicionLabel;

  constructor(
    private navController: NavController,
    private activatedRoute: ActivatedRoute,
    private actionSheetCtrl: ActionSheetController,
    private mesaTrabajoService: MesaTrabajoService,
    private estacionDataService: EstacionDataService,
    private polinDataService: PolinDataService,
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.activatedRoute.snapshot.params['id'];
    if (!id) {
      return;
    }
    this.cargando = true;
    try {
      const mesaResp = await firstValueFrom(this.mesaTrabajoService.find(+id));
      this.mesaTrabajo = mesaResp.body ?? {};
      const estaciones = await this.estacionDataService.findByMesaId(+id);
      this.estaciones = await Promise.all(
        estaciones.map(async estacion => {
          const polines = estacion.id ? await this.polinDataService.findByEstacionId(estacion.id) : [];
          const estado = estadoEstacion(polines.map(p => p.estado));
          return { estacion, polines, estado, estadoShort: ESTADO_SHORT[estado] ?? '—' };
        }),
      );
    } finally {
      this.cargando = false;
    }
  }

  /** Tap en la cabecera de la estación: registrar a nivel ESTACIÓN completa (sin polín). */
  async seleccionarEstacion(estacion: Estacion): Promise<void> {
    const sheet = await this.actionSheetCtrl.create({
      header: `Estación ${estacion.identificador ?? ''} (completa)`,
      buttons: [
        {
          text: 'Inspeccionar estación',
          handler: () =>
            this.navController.navigateForward('/tabs/entities/inspeccion/new', {
              queryParams: { estacionId: estacion.id, tipo: 'ESTACION' },
            }),
        },
        {
          text: 'Mantener estación',
          handler: () =>
            this.navController.navigateForward('/tabs/entities/mantenimiento/new', {
              queryParams: { estacionId: estacion.id, tipo: 'ESTACION' },
            }),
        },
        { text: 'Cancelar', role: 'cancel' },
      ],
    });
    await sheet.present();
  }

  async seleccionarPolin(polin: Polin): Promise<void> {
    const sheet = await this.actionSheetCtrl.create({
      header: `Polín ${polin.identificador ?? ''}`,
      buttons: [
        {
          text: 'Nueva inspección',
          handler: () => this.navController.navigateForward('/tabs/entities/inspeccion/new', { queryParams: { polinId: polin.id } }),
        },
        {
          text: 'Nuevo mantenimiento',
          handler: () => this.navController.navigateForward('/tabs/entities/mantenimiento/new', { queryParams: { polinId: polin.id } }),
        },
        { text: 'Cancelar', role: 'cancel' },
      ],
    });
    await sheet.present();
  }
}
