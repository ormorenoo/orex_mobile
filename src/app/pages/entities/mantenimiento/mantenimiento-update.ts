import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder as FormBuilder } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Polin } from '../polin';
import { Inspeccion } from '../inspeccion';
import { Mantenimiento } from './mantenimiento.model';
import { Area } from '../area';
import { Faena } from '../faena';
import { CorreaTransportadora } from '../correa-transportadora';
import { MesaTrabajo } from '../mesa-trabajo';
import { Estacion } from '../estacion';
import { CondicionPolin } from '../enumerations/condicion-polin.model';
import { MantenimientoDataService } from './mantenimiento-data.service';
import { FaenaDataService } from '../faena/faena-data.service';
import { AreaFaenaDataService } from '../area-faena/area-faena-data.service';
import { CorreaTransportadoraDataService } from '../correa-transportadora/correa-transportadora-data.service';
import { MesaTrabajoDataService } from '../mesa-trabajo/mesa-trabajo-data.service';
import { EstacionDataService } from '../estacion/estacion-data.service';
import { PolinDataService } from '../polin/polin-data.service';

@Component({
  selector: 'page-mantenimiento-update',
  templateUrl: 'mantenimiento-update.html',
  styleUrl: 'mantenimiento-update.scss',
})
export class MantenimientoUpdatePage implements OnInit {
  mantenimiento: Mantenimiento;
  faenas: Faena[] = [];
  areas: Area[] = [];
  correas: CorreaTransportadora[] = [];
  mesas: MesaTrabajo[] = [];
  estaciones: Estacion[] = [];
  polins: Polin[];
  inspeccions: Inspeccion[];
  fechaCreacion: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;
  condicion = CondicionPolin;
  condicionKeys = Object.keys(CondicionPolin);
  imagenGeneral: File | undefined = undefined;
  imagenDetalle: File | undefined = undefined;

  form = inject(FormBuilder).group({
    id: [null, []],
    fechaCreacion: [null, []],
    condicionPolin: [null, []],
    rutaFotoGeneral: [null, []],
    rutaFotoDetallePolin: [null, []],
    inspeccion: [null, []],
    polin: [null, []],
    faena: [null, []],
    area: [null, []],
    correa: [null, []],
    mesa: [null, []],
    estacion: [null, []],
    applicationUser: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private polinDataService: PolinDataService,
    private faenaDataService: FaenaDataService,
    private areaFaenaDataService: AreaFaenaDataService,
    private correaTransportadoraDataService: CorreaTransportadoraDataService,
    private mesaTrabajoDataService: MesaTrabajoDataService,
    private estacionDataService: EstacionDataService,
    private manteminientoDataService: MantenimientoDataService,
  ) {
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.loadFaenasOptions();
    this.activatedRoute.data.subscribe(response => {
      this.mantenimiento = response.data;
      this.isNew = this.mantenimiento.id === null || this.mantenimiento.id === undefined;
      this.updateForm(this.mantenimiento);
    });
  }

  async loadFaenasOptions(): Promise<void> {
    this.faenas = await this.faenaDataService.getAll();
    if (this.form.get(['faena']).value) {
      this.loadAreasOptions(this.form.get(['faena']).value);
    }
  }

  async loadAreasOptions(faena: Faena | null): Promise<void> {
    if (faena?.id) {
      this.areas = await this.areaFaenaDataService.findAreasByFaenaId(faena.id);
      if (this.form.get(['area']).value && this.form.get(['faena']).value) {
        this.loadCorreasTransportadorasOptions(this.form.get(['area']).value, this.form.get(['faena']).value);
      }
    }
  }

  async loadCorreasTransportadorasOptions(area: Area | null, faena: Faena | null): Promise<void> {
    if (area?.id && faena?.id) {
      this.correas = await this.correaTransportadoraDataService.findCorreaByAreaIdAndFaenaId(area.id, faena.id);
      if (this.form.get(['correa']).value) {
        this.loadMesasTrabajoOptions(this.form.get(['correa']).value);
      }
    }
  }

  async loadMesasTrabajoOptions(correa: CorreaTransportadora | null): Promise<void> {
    if (correa?.id) {
      this.mesas = await this.mesaTrabajoDataService.findByCorreaId(correa.id);
      if (this.form.get(['mesa']).value) {
        this.loadEstacionesOptions(this.form.get(['mesa']).value);
      }
    }
  }

  async loadEstacionesOptions(mesa: MesaTrabajo | null): Promise<void> {
    if (mesa?.id) {
      this.estaciones = await this.estacionDataService.findByMesaId(mesa.id);
      if (this.form.get(['estacion']).value) {
        this.loadPolinesOptions(this.form.get(['estacion']).value);
      }
    }
  }

  async loadPolinesOptions(estacion: Estacion | null): Promise<void> {
    if (estacion?.id) {
      this.polins = await this.polinDataService.findByEstacionId(estacion.id);
    }
  }

  compareFaena(first: Faena, second: Faena): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  compareArea(first: Area, second: Area): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  compareCorrea(o1: CorreaTransportadora | null, o2: CorreaTransportadora | null): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  compareMesa(o1: MesaTrabajo | null, o2: MesaTrabajo | null): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  compareEstacion(o1: Estacion | null, o2: Estacion | null): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  comparePolin(first: Polin, second: Polin): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackFaenaById(index: number, item: Faena) {
    return item.id;
  }

  trackAreaById(index: number, item: Area) {
    return item.id;
  }

  trackCorreaTransportadoraById(_index: number, item: CorreaTransportadora): number {
    return item.id;
  }

  trackMesaTrabajoById(_index: number, item: MesaTrabajo): number {
    return item.id;
  }

  trackEstacionById(_index: number, item: Estacion): number {
    return item.id;
  }

  trackPolinById(index: number, item: Polin) {
    return item.id;
  }

  updateForm(mantenimiento: Mantenimiento) {
    this.form.patchValue({
      id: mantenimiento.id,
      fechaCreacion: mantenimiento.fechaCreacion,
      condicionPolin: mantenimiento.condicionPolin,
      rutaFotoGeneral: mantenimiento.rutaFotoGeneral,
      rutaFotoDetallePolin: mantenimiento.rutaFotoDetallePolin,
      polin: mantenimiento.polin,
      inspeccion: mantenimiento.inspeccion,
      applicationUser: mantenimiento.applicationUser,
    });
  }

  async save() {
    this.isSaving = true;

    const manteminiento = this.createFromForm();

    if (!manteminiento.fechaCreacion) {
      manteminiento.fechaCreacion = new Date().toISOString();
    }

    try {
      const result = await this.manteminientoDataService.save(manteminiento, this.imagenGeneral, this.imagenDetalle);

      this.isSaving = false;

      const toast = await this.toastCtrl.create({
        message: result.message ?? 'Operación realizada correctamente',
        duration: 2000,
        position: 'middle',
      });

      await toast.present();

      if (result.success) {
        await this.navController.navigateBack('/tabs/entities/mantenimiento');
      }
    } catch (error) {
      this.isSaving = false;
      console.error(error);

      const toast = await this.toastCtrl.create({
        message: 'Error inesperado al guardar el manteminiento',
        duration: 2000,
        position: 'middle',
      });

      await toast.present();
    }
  }

  onFileSelected(event: Event, tipo: 'general' | 'detalle'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen válido.');
        input.value = '';
        return;
      }

      if (tipo === 'general') {
        this.imagenGeneral = file;
      } else {
        this.imagenDetalle = file;
      }
    }
  }

  previousState() {
    window.history.back();
  }

  private createFromForm(): Mantenimiento {
    return {
      ...new Mantenimiento(),
      id: this.form.get(['id']).value,
      fechaCreacion: this.form.get(['fechaCreacion']).value ? new Date(this.form.get(['fechaCreacion']).value) : null,
      condicionPolin: this.form.get(['condicionPolin']).value,
      rutaFotoGeneral: this.form.get(['rutaFotoGeneral']).value,
      rutaFotoDetallePolin: this.form.get(['rutaFotoDetallePolin']).value,
      polin: this.form.get(['polin']).value,
      applicationUser: this.form.get(['applicationUser']).value,
      inspeccion: this.form.get(['inspeccion']).value,
    };
  }
}
