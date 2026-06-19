import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { UntypedFormBuilder as FormBuilder } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Polin, PolinService } from '../polin';
import { Inspeccion } from '../inspeccion';
import { Mantenimiento } from './mantenimiento.model';
import { Area } from '../area';
import { Faena } from '../faena';
import { CorreaTransportadora } from '../correa-transportadora';
import { MesaTrabajo, MesaTrabajoService } from '../mesa-trabajo';
import { Estacion, EstacionService } from '../estacion';
import {
  bloquearControles,
  resumenUbicacion,
  ResumenUbicacion,
  ubicacionDesdeEstacion,
  ubicacionDesdeMesa,
  ubicacionDesdePolin,
} from '#app/shared/utils/ubicacion.utils';
import { estadoClase, posicionLabel, tipoPolinLabel } from '#app/shared/utils/polin-ui.utils';
import { CondicionPolin } from '../enumerations/condicion-polin.model';
import { TipoFalla } from '../enumerations/tipo-falla.model';
import { TipoServicio } from '../enumerations/tipo-servicio.model';
import { TipoMantenimiento } from '../enumerations/tipo-mantenimiento.model';
import { TipoRegistro } from '../enumerations/tipo-registro.model';
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
export class MantenimientoUpdatePage implements OnInit, OnDestroy {
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
  tipoFalla = TipoFalla;
  tipoFallaKeys = Object.keys(TipoFalla);
  tipoServicio = TipoServicio;
  tipoServicioKeys = Object.keys(TipoServicio);
  tipoMantenimiento = TipoMantenimiento;
  tipoMantenimientoKeys = Object.keys(TipoMantenimiento);
  imagenGeneral: File | undefined = undefined;
  imagenDetalle: File | undefined = undefined;
  previewGeneral?: string;
  previewDetalle?: string;
  metodoGeneral: 'camara' | 'archivo' = 'camara';
  metodoDetalle: 'camara' | 'archivo' = 'camara';

  /** Cuando se entra desde una mesa/estación/polín la ubicación se precarga y bloquea. */
  ubicacionAutocompletada = false;
  estacionFija = false;
  polinFijo = false;
  resumen?: ResumenUbicacion;
  /** Mesa de origen, para volver a su detalle al guardar. */
  mesaTrabajoIdActual?: number;

  // Helpers de presentación (prototipo).
  estadoClase = estadoClase;
  posicionLabel = posicionLabel;
  tipoPolinLabel = tipoPolinLabel;

  condicionOpciones = [
    { key: 'OPERATIVO', label: 'Operativo', clase: 'seg--ok' },
    { key: 'OBSERVACION', label: 'Observación', clase: 'seg--obs' },
    { key: 'NO_OPERATIVO', label: 'No operativo', clase: 'seg--no' },
  ];
  tipoMantenimientoOpciones = [
    { key: 'CAMBIO', label: 'Cambio' },
    { key: 'REPARACION', label: 'Reparación' },
  ];
  TipoRegistro = TipoRegistro;

  /** ¿El registro es a nivel estación (sin polín)? Espejo de la web. */
  get esEstacion(): boolean {
    return this.form.get('tipo')?.value === TipoRegistro.ESTACION;
  }

  /** Cambia el tipo de registro (polín ↔ estación) y limpia el polín si pasa a estación. */
  onTipoChange(tipo: TipoRegistro): void {
    this.form.get('tipo')?.setValue(tipo);
    if (tipo === TipoRegistro.ESTACION) {
      this.form.get('polin')?.setValue(null);
    }
  }

  form = inject(FormBuilder).group({
    id: [null, []],
    fechaCreacion: [null, []],
    tipo: [TipoRegistro.POLIN, []],
    condicion: [null, []],
    tipoFalla: [null, []],
    tipoServicio: [null, []],
    tipoMantenimiento: [null, []],
    comentarios: [null, []],
    rutaFotoGeneral: [null, []],
    rutaFotoDetalle: [null, []],
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
    private mesaTrabajoService: MesaTrabajoService,
    private estacionService: EstacionService,
    private polinService: PolinService,
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
    this.activatedRoute.queryParams.subscribe(params => {
      this.handleQueryParams(params['polinId'] ?? null, params['estacionId'] ?? null, params['mesaTrabajoId'] ?? null, params['tipo'] ?? null);
    });
  }

  /**
   * Precarga y bloquea la ubicación cuando se crea desde una mesa/estación/polín
   * (flujo del QR). Espejo de mantenimiento-update.component.ts en la web.
   */
  protected handleQueryParams(polinId: string | null, estacionId: string | null, mesaTrabajoId: string | null, tipo: string | null = null): void {
    if (polinId) {
      this.polinService.find(+polinId).subscribe(res => {
        if (res.body) {
          const valores = ubicacionDesdePolin(res.body);
          this.form.patchValue(valores);
          this.polins = [res.body];
          this.mesaTrabajoIdActual = res.body.estacion?.mesaTrabajo?.id;
          this.bloquearUbicacion(true, true);
          this.resumen = resumenUbicacion(valores);
        }
      });
      return;
    }

    if (estacionId) {
      this.estacionService.find(+estacionId).subscribe(res => {
        if (res.body) {
          const valores = ubicacionDesdeEstacion(res.body);
          this.form.patchValue(valores);
          this.mesaTrabajoIdActual = res.body.mesaTrabajo?.id;
          if (tipo === TipoRegistro.ESTACION) {
            // Registro a nivel ESTACIÓN completa (sin polín); se cargan polines por si alterna a "Por polín".
            this.form.get('tipo')?.setValue(TipoRegistro.ESTACION);
          }
          this.loadPolinesOptions(res.body);
          this.bloquearUbicacion(true, false);
          this.resumen = resumenUbicacion(valores);
        }
      });
      return;
    }

    if (mesaTrabajoId) {
      this.mesaTrabajoIdActual = +mesaTrabajoId;
      this.mesaTrabajoService.find(+mesaTrabajoId).subscribe(res => {
        if (res.body) {
          const valores = ubicacionDesdeMesa(res.body);
          this.form.patchValue(valores);
          this.loadEstacionesOptions(res.body);
          this.bloquearUbicacion(false, false);
          this.resumen = resumenUbicacion(valores);
        }
      });
      return;
    }
  }

  /** Selección de polín como tarjeta (radio única). */
  seleccionarPolin(polin: Polin): void {
    this.form.get('polin')?.setValue(polin);
  }

  polinSeleccionado(polin: Polin): boolean {
    return this.form.get('polin')?.value?.id === polin.id;
  }

  setControl(control: string, value: string): void {
    this.form.get(control)?.setValue(value);
  }

  esControl(control: string, value: string): boolean {
    return this.form.get(control)?.value === value;
  }

  /** Bloquea faena/área/correa/mesa (siempre) y opcionalmente estación y polín. */
  private bloquearUbicacion(estacionFija: boolean, polinFijo: boolean): void {
    this.ubicacionAutocompletada = true;
    this.estacionFija = estacionFija;
    this.polinFijo = polinFijo;
    const controles = [this.form.get('faena'), this.form.get('area'), this.form.get('correa'), this.form.get('mesa')];
    if (estacionFija) {
      controles.push(this.form.get('estacion'));
    }
    if (polinFijo) {
      controles.push(this.form.get('polin'));
    }
    bloquearControles(...controles);
  }

  ngOnDestroy() {
    if (this.previewGeneral) {
      URL.revokeObjectURL(this.previewGeneral);
    }
    if (this.previewDetalle) {
      URL.revokeObjectURL(this.previewDetalle);
    }
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
      condicion: mantenimiento.condicion,
      tipoFalla: mantenimiento.tipoFalla,
      tipoServicio: mantenimiento.tipoServicio,
      tipoMantenimiento: mantenimiento.tipoMantenimiento,
      comentarios: mantenimiento.comentarios,
      rutaFotoGeneral: mantenimiento.rutaFotoGeneral,
      rutaFotoDetalle: mantenimiento.rutaFotoDetalle,
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
        if (this.mesaTrabajoIdActual) {
          await this.navController.navigateBack(`/tabs/entities/mesa-trabajo/${this.mesaTrabajoIdActual}/view`, {
            queryParams: { nuevo: 'mantenimiento' },
          });
        } else {
          await this.navController.navigateBack('/tabs/entities/mantenimiento');
        }
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
        alert('Por favor, selecciona una imagen válida.');
        input.value = '';
        return;
      }

      const previewUrl = URL.createObjectURL(file);

      if (tipo === 'general') {
        this.imagenGeneral = file;
        this.previewGeneral = previewUrl;
      } else {
        this.imagenDetalle = file;
        this.previewDetalle = previewUrl;
      }
    }
  }

  async takePhoto(tipo: 'general' | 'detalle') {
    const photo = await Camera.getPhoto({
      quality: 70,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    });

    const file = await this.uriToFile(photo.webPath, `foto-${tipo}.jpg`);
    const previewUrl = URL.createObjectURL(file);

    if (tipo === 'general') {
      this.imagenGeneral = file;
      this.previewGeneral = previewUrl;
    } else {
      this.imagenDetalle = file;
      this.previewDetalle = previewUrl;
    }
  }

  onMetodoGeneralChange(event: CustomEvent) {
    const value = event.detail.value as 'camara' | 'archivo';
    this.metodoGeneral = value;
  }

  onMetodoDetalleChange(event: CustomEvent) {
    const value = event.detail.value as 'camara' | 'archivo';
    this.metodoDetalle = value;
  }

  previousState() {
    window.history.back();
  }

  private createFromForm(): Mantenimiento {
    return {
      ...new Mantenimiento(),
      id: this.form.get(['id']).value,
      fechaCreacion: this.form.get(['fechaCreacion']).value ? new Date(this.form.get(['fechaCreacion']).value) : null,
      tipo: this.form.get(['tipo']).value,
      condicion: this.form.get(['condicion']).value,
      tipoFalla: this.form.get(['tipoFalla']).value,
      tipoServicio: this.form.get(['tipoServicio']).value,
      // Para polín el tipo de mantenimiento siempre es CAMBIO; solo aplica selección a nivel estación.
      tipoMantenimiento: this.esEstacion ? this.form.get(['tipoMantenimiento']).value : 'CAMBIO',
      comentarios: this.form.get(['comentarios']).value,
      rutaFotoGeneral: this.form.get(['rutaFotoGeneral']).value,
      rutaFotoDetalle: this.form.get(['rutaFotoDetalle']).value,
      polin: this.esEstacion ? null : this.form.get(['polin']).value,
      estacion: this.form.get(['estacion']).value,
      applicationUser: this.form.get(['applicationUser']).value,
      inspeccion: this.form.get(['inspeccion']).value,
    };
  }

  private async uriToFile(uri: string, fileName: string): Promise<File> {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
  }
}
