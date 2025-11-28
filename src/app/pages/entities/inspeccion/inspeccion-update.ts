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

  loadFaenasOptions(): void {
    this.faenaService.query().subscribe(data => (this.faenas = data.body ?? []));
    if (this.form.get(['faena']).value) {
      this.loadAreasOptions(this.form.get(['faena']).value);
    }
  }

  loadAreasOptions(faena: Faena | null): void {
    if (faena?.id) {
      this.areaService.findByFaenaId(faena.id).subscribe(data => {
        this.areas = data.body ?? [];
        if (this.form.get(['area']).value && this.form.get(['faena']).value) {
          this.loadCorreasTransportadorasOptions(this.form.get(['area']).value, this.form.get(['faena']).value);
        }
      });
    }
  }

  loadCorreasTransportadorasOptions(area: Area | null, faena: Faena | null): void {
    if (area?.id && faena?.id) {
      this.correaTransportadoraService.findByAreaIdAndFaenaId(area.id, faena.id).subscribe(data => {
        this.correas = data.body ?? [];
        if (this.form.get(['correa']).value) {
          this.loadMesasTrabajoOptions(this.form.get(['correa']).value);
        }
      });
    }
  }

  loadMesasTrabajoOptions(correa: CorreaTransportadora | null): void {
    if (correa?.id) {
      this.mesaTrabajoService.findByCorreaId(correa.id).subscribe(data => {
        this.mesas = data.body ?? [];
        if (this.form.get(['mesa']).value) {
          this.loadEstacionesOptions(this.form.get(['mesa']).value);
        }
      });
    }
  }

  loadEstacionesOptions(mesa: MesaTrabajo | null): void {
    if (mesa?.id) {
      this.estacionService.findByMesaId(mesa.id).subscribe(data => {
        this.estaciones = data.body ?? [];
        if (this.form.get(['estacion']).value) {
          this.loadPolinesOptions(this.form.get(['estacion']).value);
        }
      });
    }
  }

  loadPolinesOptions(estacion: Estacion | null): void {
    if (estacion?.id) {
      this.polinService.findByEstacionId(estacion.id).subscribe(data => (this.polins = data.body ?? []));
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
      fechaCreacion: this.isNew ? new Date().toISOString() : inspeccion.fechaCreacion,
      condicionPolin: inspeccion.condicionPolin,
      criticidad: inspeccion.criticidad,
      observacion: inspeccion.observacion,
      comentarios: inspeccion.comentarios,
      rutaFotoGeneral: inspeccion.rutaFotoGeneral,
      rutaFotoDetallePolin: inspeccion.rutaFotoDetallePolin,
      polin: inspeccion.polin,
    });
  }

  save() {
    this.isSaving = true;
    const inspeccion = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.inspeccionService.update(inspeccion));
    } else {
      this.subscribeToSaveResponse(this.inspeccionService.create(inspeccion));
    }
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
    };
  }
}
