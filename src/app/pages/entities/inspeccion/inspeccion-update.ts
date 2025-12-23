import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder as FormBuilder } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Polin } from '../polin';
import { Inspeccion } from './inspeccion.model';
import { Estacion } from '../estacion';
import { Faena } from '../faena';
import { Area } from '../area';
import { CorreaTransportadora } from '../correa-transportadora';
import { MesaTrabajo } from '../mesa-trabajo';
import { Criticidad } from '../enumerations/criticidad.model';
import { CondicionPolin } from '../enumerations/condicion-polin.model';
import { Observacion } from '../enumerations/observacion.model';
import { FaenaDataService } from '../faena/faena-data.service';
import { InspeccionDataService } from './inspeccion-data.service';
import { AreaFaenaDataService } from '../area-faena/area-faena-data.service';
import { CorreaTransportadoraDataService } from '../correa-transportadora/correa-transportadora-data.service';
import { MesaTrabajoDataService } from '../mesa-trabajo/mesa-trabajo-data.service';
import { EstacionDataService } from '../estacion/estacion-data.service';
import { PolinDataService } from '../polin/polin-data.service';

@Component({
  selector: 'page-inspeccion-update',
  templateUrl: 'inspeccion-update.html',
  styleUrl: 'inspeccion-update.scss',
})
export class InspeccionUpdatePage implements OnInit {
  inspeccion: Inspeccion;
  faenas: Faena[] = [];
  areas: Area[] = [];
  correas: CorreaTransportadora[] = [];
  mesas: MesaTrabajo[] = [];
  estaciones: Estacion[] = [];
  polins: Polin[];
  fechaCreacion: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;
  criticidad = Criticidad;
  criticidadKeys = Object.keys(Criticidad);
  condicion = CondicionPolin;
  condicionKeys = Object.keys(CondicionPolin);
  observacion = Observacion;
  observacionKeys = Object.keys(Observacion);
  imagenGeneral: File | undefined = undefined;
  imagenDetalle: File | undefined = undefined;

  form = inject(FormBuilder).group({
    id: [null, []],
    fechaCreacion: [null, []],
    condicionPolin: [null, []],
    criticidad: [null, []],
    observacion: [null, []],
    comentarios: [null, []],
    rutaFotoGeneral: [null, []],
    rutaFotoDetallePolin: [null, []],
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
    private inspeccionDataService: InspeccionDataService,
    private areaFaenaDataService: AreaFaenaDataService,
    private correaTransportadoraDataService: CorreaTransportadoraDataService,
    private mesaTrabajoDataService: MesaTrabajoDataService,
    private estacionDataService: EstacionDataService,
  ) {
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.loadFaenasOptions();
    this.activatedRoute.data.subscribe(response => {
      this.inspeccion = response.data;
      this.isNew = this.inspeccion.id === null || this.inspeccion.id === undefined;
      this.updateForm(this.inspeccion);
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

  updateForm(inspeccion: Inspeccion) {
    this.form.patchValue({
      id: inspeccion.id,
      fechaCreacion: inspeccion.fechaCreacion,
      condicionPolin: inspeccion.condicionPolin,
      criticidad: inspeccion.criticidad,
      observacion: inspeccion.observacion,
      comentarios: inspeccion.comentarios,
      rutaFotoGeneral: inspeccion.rutaFotoGeneral,
      rutaFotoDetallePolin: inspeccion.rutaFotoDetallePolin,
      polin: inspeccion.polin,
      applicationUser: inspeccion.applicationUser,
    });
  }

  async save() {
    this.isSaving = true;

    const inspeccion = this.createFromForm();

    if (!inspeccion.fechaCreacion) {
      inspeccion.fechaCreacion = new Date().toISOString();
    }

    try {
      const result = await this.inspeccionDataService.save(inspeccion, this.imagenGeneral, this.imagenDetalle);

      this.isSaving = false;

      const toast = await this.toastCtrl.create({
        message: result.message ?? 'Operación realizada correctamente',
        duration: 2000,
        position: 'middle',
      });

      await toast.present();

      if (result.success) {
        await this.navController.navigateBack('/tabs/entities/inspeccion');
      }
    } catch (error) {
      this.isSaving = false;
      console.error(error);

      const toast = await this.toastCtrl.create({
        message: 'Error inesperado al guardar la inspección',
        duration: 2000,
        position: 'middle',
      });

      await toast.present();
    }
  }

  previousState() {
    window.history.back();
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

  private createFromForm(): Inspeccion {
    return {
      ...new Inspeccion(),
      id: this.form.get(['id']).value,
      fechaCreacion: this.form.get(['fechaCreacion']).value ? new Date(this.form.get(['fechaCreacion']).value) : null,
      condicionPolin: this.form.get(['condicionPolin']).value,
      criticidad: this.form.get(['criticidad']).value,
      observacion: this.form.get(['observacion']).value,
      comentarios: this.form.get(['comentarios']).value,
      rutaFotoGeneral: this.form.get(['rutaFotoGeneral']).value,
      rutaFotoDetallePolin: this.form.get(['rutaFotoDetallePolin']).value,
      polin: this.form.get(['polin']).value,
      applicationUser: this.form.get(['applicationUser']).value,
    };
  }
}
