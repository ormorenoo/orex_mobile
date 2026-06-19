import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Estacion } from './estacion.model';
import { EstacionService } from './estacion.service';
import { Polin } from '../polin';
import { PolinDataService } from '../polin/polin-data.service';
import { estadoClase, estadoEstacion, estadoLabel, ESTADO_SHORT, posicionLabel, tipoPolinLabel } from '#app/shared/utils/polin-ui.utils';

@Component({
  selector: 'page-estacion-detail',
  templateUrl: 'estacion-detail.html',
  styleUrl: 'estacion-detail.scss',
})
export class EstacionDetailPage implements OnInit {
  estacion: Estacion = {};
  polines: Polin[] = [];
  estado = 'SIN_ESTADO';
  cargandoPolines = false;

  estadoClase = estadoClase;
  posicionLabel = posicionLabel;
  tipoPolinLabel = tipoPolinLabel;

  constructor(
    private navController: NavController,
    private estacionService: EstacionService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private polinDataService: PolinDataService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.estacion = response.data ?? {};
      if (this.estacion.id) {
        void this.cargarPolines(this.estacion.id);
      }
    });
  }

  get faena(): string | undefined {
    return this.estacion.mesaTrabajo?.correaTransportadora?.areaFaena?.faena?.nombre;
  }

  get correa(): string | undefined {
    return this.estacion.mesaTrabajo?.correaTransportadora?.tagId;
  }

  get mesa(): string | undefined {
    return this.estacion.mesaTrabajo?.identificador;
  }

  get estadoLabelText(): string {
    return estadoLabel(this.estado);
  }

  get estadoShort(): string {
    return ESTADO_SHORT[this.estado] ?? '—';
  }

  async cargarPolines(estacionId: number): Promise<void> {
    this.cargandoPolines = true;
    try {
      this.polines = await this.polinDataService.findByEstacionId(estacionId);
      this.estado = estadoEstacion(this.polines.map(p => p.estado));
    } finally {
      this.cargandoPolines = false;
    }
  }

  abrirPolin(polin: Polin): void {
    this.navController.navigateForward(`/tabs/entities/polin/${polin.id}/view`);
  }

  open(item: Estacion) {
    this.navController.navigateForward(`/tabs/entities/estacion/${item.id}/edit`);
  }

  async deleteModal(item: Estacion) {
    const alert = await this.alertController.create({
      header: '¿Eliminar este registro?',
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
        {
          text: 'Eliminar',
          handler: () => {
            this.estacionService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/estacion');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
