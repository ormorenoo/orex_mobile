import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder as FormBuilder } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Polin, PolinService } from '../polin';
import { Inspeccion } from './inspeccion.model';
import { InspeccionService } from './inspeccion.service';
import { Estacion, EstacionService } from '../estacion';
import { Faena, FaenaService } from '../faena';
import { Area, AreaService } from '../area';
import { CorreaTransportadora, CorreaTransportadoraService } from '../correa-transportadora';
import { MesaTrabajo, MesaTrabajoService } from '../mesa-trabajo';
import { Criticidad } from '../enumerations/criticidad.model';
import { CondicionPolin } from '../enumerations/condicion-polin.model';
import { Observacion } from '../enumerations/observacion.model';
import { NetworkService } from '#app/services/utils/network.service';
import { EntitiesOfflineService } from '#app/services/utils/entities-offline';
import { InspeccionOfflineService } from './inspeccion-offline-service';

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
    private polinService: PolinService,
    private faenaService: FaenaService,
    private inspeccionService: InspeccionService,
    private areaService: AreaService,
    private correaTransportadoraService: CorreaTransportadoraService,
    private mesaTrabajoService: MesaTrabajoService,
    private estacionService: EstacionService,
    private networkService: NetworkService,
    private entitiesOfflineService: EntitiesOfflineService,
    private inspeccionOfflineService: InspeccionOfflineService,
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
    const online = await this.networkService.isOnline();
    if (online) {
      this.faenaService.query().subscribe(data => (this.faenas = data.body ?? []));
    } else {
      this.faenas = this.entitiesOfflineService.getFaenas();
    }
    if (this.form.get(['faena']).value) {
      this.loadAreasOptions(this.form.get(['faena']).value);
    }
  }

  async loadAreasOptions(faena: Faena | null): Promise<void> {
    const online = await this.networkService.isOnline();
    if (faena?.id) {
      if (online) {
        this.areaService.findByFaenaId(faena.id).subscribe(data => {
          this.areas = data.body ?? [];
          if (this.form.get(['area']).value && this.form.get(['faena']).value) {
            this.loadCorreasTransportadorasOptions(this.form.get(['area']).value, this.form.get(['faena']).value);
          }
        });
      } else {
        this.areas = this.findAreasOffline(faena.id);
      }
    }
  }

  findAreasOffline(faenaId: number): Area[] {
    var areasTemp = this.entitiesOfflineService.getAreas();
    return areasTemp.filter(area => area.faenas?.some(f => f.id === faenaId));
  }

  async loadCorreasTransportadorasOptions(area: Area | null, faena: Faena | null): Promise<void> {
    const online = await this.networkService.isOnline();
    if (area?.id && faena?.id) {
      if (online) {
        this.correaTransportadoraService.findByAreaIdAndFaenaId(area.id, faena.id).subscribe(data => {
          this.correas = data.body ?? [];
          if (this.form.get(['correa']).value) {
            this.loadMesasTrabajoOptions(this.form.get(['correa']).value);
          }
        });
      } else {
        this.correas = this.findCorreasOffline(faena.id, area.id);
      }
    }
  }

  findCorreasOffline(faenaId: number, areaId: number): CorreaTransportadora[] {
    const correasTemp = this.entitiesOfflineService.getCorreas() ?? [];
    return correasTemp.filter(correa => correa.areaFaena && correa.areaFaena.faena?.id === faenaId && correa.areaFaena.area?.id === areaId);
  }

  async loadMesasTrabajoOptions(correa: CorreaTransportadora | null): Promise<void> {
    const online = await this.networkService.isOnline();
    if (correa?.id) {
      if (online) {
        this.mesaTrabajoService.findByCorreaId(correa.id).subscribe(data => {
          this.mesas = data.body ?? [];
          if (this.form.get(['mesa']).value) {
            this.loadEstacionesOptions(this.form.get(['mesa']).value);
          }
        });
      } else {
        this.mesas = this.findMesasOffline(correa.id);
      }
    }
  }

  findMesasOffline(correaId: number): MesaTrabajo[] {
    var mesasTemp = this.entitiesOfflineService.getMesas();
    return mesasTemp.filter(mesa => mesa.correaTransportadora.id === correaId);
  }

  async loadEstacionesOptions(mesa: MesaTrabajo | null): Promise<void> {
    const online = await this.networkService.isOnline();
    if (mesa?.id) {
      if (online) {
        this.estacionService.findByMesaId(mesa.id).subscribe(data => {
          this.estaciones = data.body ?? [];
          if (this.form.get(['estacion']).value) {
            this.loadPolinesOptions(this.form.get(['estacion']).value);
          }
        });
      } else {
        this.estaciones = this.findEstacionesOffline(mesa.id);
      }
    }
  }

  findEstacionesOffline(id: number): Estacion[] {
    var estacionesTemp = this.entitiesOfflineService.getEstaciones();
    return estacionesTemp.filter(mesa => mesa.mesaTrabajo.id === id);
  }

  async loadPolinesOptions(estacion: Estacion | null): Promise<void> {
    const online = await this.networkService.isOnline();
    if (estacion?.id) {
      if (online) {
        this.polinService.findByEstacionId(estacion.id).subscribe(data => (this.polins = data.body ?? []));
      } else {
        this.polins = this.findPolinesOffline(estacion.id);
      }
    }
  }
  findPolinesOffline(id: number): Polin[] {
    var polinesTemp = this.entitiesOfflineService.getPolins();
    return polinesTemp.filter(mesa => mesa.estacion.id === id);
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
    const online = await this.networkService.isOnline();
    if (online) {
      if (!this.isNew) {
        this.subscribeToSaveResponse(this.inspeccionService.update(inspeccion));
      } else {
        this.subscribeToSaveResponse(this.inspeccionService.create(inspeccion, this.imagenGeneral, this.imagenDetalle));
      }
    } else {
      // --- MODO OFFLINE ---
      this.saveOffline(inspeccion);
    }
  }

  async saveOffline(inspeccion) {
    this.isSaving = true;

    if (!inspeccion.fechaCreacion) {
      inspeccion.fechaCreacion = new Date().toISOString();
    }

    const result = await this.inspeccionOfflineService.saveOffline(inspeccion, this.imagenGeneral, this.imagenDetalle);

    if (result.success) {
      await this.onOfflineSaveSuccess(result.id);
    } else {
      await this.onOfflineSaveError(result.error);
    }
  }

  async onOfflineSaveSuccess(id: string) {
    this.isSaving = false;

    const toast = await this.toastCtrl.create({
      message: 'Inspección guardada offline correctamente.',
      duration: 2000,
      position: 'middle',
    });

    await toast.present();
    await this.navController.navigateBack('/tabs/entities/inspeccion');
  }

  async onOfflineSaveError(error: any) {
    this.isSaving = false;
    console.error(error);

    const toast = await this.toastCtrl.create({
      message: 'Error al guardar la inspección offline.',
      duration: 2000,
      position: 'middle',
    });

    await toast.present();
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Inspeccion ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/inspeccion');
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

  async onError(error) {
    this.isSaving = false;
    console.error(error);
    const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
    await toast.present();
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Inspeccion>>) {
    result.subscribe(
      (res: HttpResponse<Inspeccion>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error),
    );
  }

  private createFromForm(): Inspeccion {
    return {
      ...new Inspeccion(),
      id: this.form.get(['id']).value,
      fechaCreacion: new Date(this.form.get(['fechaCreacion']).value),
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
