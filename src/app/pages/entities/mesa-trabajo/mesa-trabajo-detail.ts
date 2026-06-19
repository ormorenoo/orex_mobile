import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import * as QRCode from 'qrcode';
import { MesaTrabajo } from './mesa-trabajo.model';
import { MesaTrabajoService } from './mesa-trabajo.service';
import { Estacion } from '../estacion';
import { Polin } from '../polin';
import { Inspeccion } from '../inspeccion';
import { Mantenimiento } from '../mantenimiento';
import { EstacionDataService } from '../estacion/estacion-data.service';
import { PolinDataService } from '../polin/polin-data.service';
import { InspeccionService } from '../inspeccion/inspeccion.service';
import { MantenimientoService } from '../mantenimiento/mantenimiento.service';
import { estadoClase } from '#app/shared/utils/polin-ui.utils';

interface EstacionConPolines {
  estacion: Estacion;
  polines: Polin[];
}

interface ItemActividad {
  kind: 'inspeccion' | 'mantenimiento';
  label: string;
  estado: string;
  polin?: string;
  detalle: string;
  fecha: any;
  nuevo: boolean;
}

@Component({
  selector: 'page-mesa-trabajo-detail',
  templateUrl: 'mesa-trabajo-detail.html',
  styleUrl: 'mesa-trabajo-detail.scss',
})
export class MesaTrabajoDetailPage implements OnInit {
  mesaTrabajo: MesaTrabajo = {};
  estaciones: EstacionConPolines[] = [];
  inspecciones: Inspeccion[] = [];
  mantenimientos: Mantenimiento[] = [];
  actividad: ItemActividad[] = [];
  cargandoEstaciones = false;

  // Resumen de estados (Variante B).
  counts = { op: 0, obs: 0, no: 0 };
  heatDots: string[] = [];
  estCount = 0;
  polinTotal = 0;

  /** Tipo de registro recién creado (para resaltar), recibido por queryParam. */
  resaltar?: string;

  // QR
  qrDataUrl = '';
  readonly logoOrex = 'assets/img/logo_orex_mobile_full.png';
  private readonly webBase = 'https://orex.cl';

  estadoClase = estadoClase;

  constructor(
    private navController: NavController,
    private mesaTrabajoService: MesaTrabajoService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private estacionDataService: EstacionDataService,
    private polinDataService: PolinDataService,
    private inspeccionService: InspeccionService,
    private mantenimientoService: MantenimientoService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.resaltar = params['nuevo'];
    });
    this.activatedRoute.data.subscribe(response => {
      this.mesaTrabajo = response.data ?? {};
      if (this.mesaTrabajo.id) {
        void this.generarQr();
        void this.cargarEstaciones(this.mesaTrabajo.id);
        this.cargarInspecciones(this.mesaTrabajo.id);
        this.cargarMantenimientos(this.mesaTrabajo.id);
      }
    });
  }

  get faena(): string | undefined {
    return this.mesaTrabajo.correaTransportadora?.areaFaena?.faena?.nombre;
  }

  get area(): string | undefined {
    return this.mesaTrabajo.correaTransportadora?.areaFaena?.area?.nombre;
  }

  get correa(): string | undefined {
    return this.mesaTrabajo.correaTransportadora?.tagId;
  }

  private async generarQr(): Promise<void> {
    if (!this.mesaTrabajo.id) {
      this.qrDataUrl = '';
      return;
    }
    const url = `${this.webBase}/mesa-trabajo/${this.mesaTrabajo.id}/view`;
    this.qrDataUrl = await QRCode.toDataURL(url, { errorCorrectionLevel: 'M', margin: 1, width: 240 });
  }

  async cargarEstaciones(mesaId: number): Promise<void> {
    this.cargandoEstaciones = true;
    try {
      const estaciones = await this.estacionDataService.findByMesaId(mesaId);
      this.estaciones = await Promise.all(
        estaciones.map(async estacion => ({
          estacion,
          polines: estacion.id ? await this.polinDataService.findByEstacionId(estacion.id) : [],
        })),
      );
      this.calcularResumen();
    } finally {
      this.cargandoEstaciones = false;
    }
  }

  private calcularResumen(): void {
    let op = 0;
    let obs = 0;
    let no = 0;
    const dots: string[] = [];
    this.estaciones.forEach(item =>
      item.polines.forEach(p => {
        const estado = String(p.estado);
        if (estado === 'OPERATIVO') {
          op++;
        } else if (estado === 'OBSERVACION') {
          obs++;
        } else if (estado === 'NO_OPERATIVO') {
          no++;
        }
        dots.push(estado);
      }),
    );
    this.counts = { op, obs, no };
    this.heatDots = dots;
    this.estCount = this.estaciones.length;
    this.polinTotal = dots.length;
  }

  cargarInspecciones(mesaId: number): void {
    this.inspeccionService.findByMesa(mesaId).subscribe(res => {
      this.inspecciones = res.body ?? [];
      this.construirActividad();
    });
  }

  cargarMantenimientos(mesaId: number): void {
    this.mantenimientoService.findByMesa(mesaId).subscribe(res => {
      this.mantenimientos = res.body ?? [];
      this.construirActividad();
    });
  }

  /** Feed cronológico mixto inspección + mantenimiento (Variante B). */
  private construirActividad(): void {
    const insp: ItemActividad[] = this.inspecciones.map(i => ({
      kind: 'inspeccion',
      label: 'Inspección',
      estado: String(i.condicion),
      polin: i.polin?.identificador,
      detalle: [i.tipoFalla, i.criticidad].filter(Boolean).join(' · ') || 'Sin observaciones',
      fecha: i.fechaCreacion,
      nuevo: false,
    }));
    const mant: ItemActividad[] = this.mantenimientos.map(m => ({
      kind: 'mantenimiento',
      label: 'Mantenimiento',
      estado: String(m.condicion),
      polin: m.polin?.identificador,
      detalle: [m.tipoMantenimiento, m.tipoFalla].filter(Boolean).join(' · ') || 'Mantenimiento',
      fecha: m.fechaCreacion,
      nuevo: false,
    }));
    const merged = [...insp, ...mant].sort((a, b) => this.ts(b.fecha) - this.ts(a.fecha));
    if (this.resaltar && merged.length) {
      const idx = merged.findIndex(x => x.kind === this.resaltar);
      if (idx >= 0) {
        merged[idx].nuevo = true;
      }
    }
    this.actividad = merged.slice(0, 8);
  }

  private ts(fecha: any): number {
    if (!fecha) {
      return 0;
    }
    const t = new Date(fecha).getTime();
    return isNaN(t) ? 0 : t;
  }

  /** Comparte el enlace de la mesa (Web Share API si está disponible). */
  async compartirQr(): Promise<void> {
    const url = `${this.webBase}/mesa-trabajo/${this.mesaTrabajo.id}/view`;
    const navAny = navigator as any;
    if (navAny.share) {
      try {
        await navAny.share({ title: `Mesa ${this.mesaTrabajo.identificador ?? ''}`, text: 'Detalle de la mesa de trabajo', url });
        return;
      } catch {
        return;
      }
    }
    const toast = await this.toastCtrl.create({ message: url, duration: 2500, position: 'bottom' });
    await toast.present();
  }

  /** Acciones a nivel mesa (autocompleta faena/área/correa/mesa). */
  nuevaInspeccion(): void {
    this.navController.navigateForward('/tabs/entities/inspeccion/new', {
      queryParams: { mesaTrabajoId: this.mesaTrabajo.id },
    });
  }

  nuevoMantenimiento(): void {
    this.navController.navigateForward('/tabs/entities/mantenimiento/new', {
      queryParams: { mesaTrabajoId: this.mesaTrabajo.id },
    });
  }

  irAEstaciones(): void {
    this.navController.navigateForward(`/tabs/entities/mesa-trabajo/${this.mesaTrabajo.id}/estaciones`);
  }

  open(item: MesaTrabajo) {
    this.navController.navigateForward(`/tabs/entities/mesa-trabajo/${item.id}/edit`);
  }

  async deleteModal(item: MesaTrabajo) {
    const alert = await this.alertController.create({
      header: '¿Eliminar este registro?',
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
        {
          text: 'Eliminar',
          handler: () => {
            this.mesaTrabajoService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/mesa-trabajo');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
