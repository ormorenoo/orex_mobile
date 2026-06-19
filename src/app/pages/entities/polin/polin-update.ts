import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder as FormBuilder } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Estacion, EstacionService } from '../estacion';
import { Polin } from './polin.model';
import { PolinService } from './polin.service';

@Component({
  selector: 'page-polin-update',
  templateUrl: 'polin-update.html',
  styleUrls: ['polin-update.scss'],
})
export class PolinUpdatePage implements OnInit {
  polin: Polin;
  estacions: Estacion[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  readonly posicionPolinOptions: { value: string; label: string }[] = [
    { value: 'UNICO', label: 'PosicionPolin.UNICO' },
    { value: 'CENTRAL', label: 'PosicionPolin.CENTRAL' },
    { value: 'CENTRAL_DERECHO', label: 'PosicionPolin.CENTRAL_DERECHO' },
    { value: 'CENTRAL_IZQUIERDO', label: 'PosicionPolin.CENTRAL_IZQUIERDO' },
    { value: 'DERECHO', label: 'PosicionPolin.DERECHO' },
    { value: 'IZQUIERDO', label: 'PosicionPolin.IZQUIERDO' },
  ];

  readonly tipoPolinOptions: { value: string; label: string }[] = [
    { value: 'IMPACTO', label: 'TipoPolin.IMPACTO' },
    { value: 'RETORNO', label: 'TipoPolin.RETORNO' },
    { value: 'CARGA', label: 'TipoPolin.CARGA' },
    { value: 'PESOMETRICO', label: 'TipoPolin.PESOMETRICO' },
    { value: 'AUTOLINEANTE', label: 'TipoPolin.AUTOLINEANTE' },
  ];

  form = inject(FormBuilder).group({
    id: [null, []],
    identificador: [null, []],
    descripcion: [null, []],
    posicionPolin: [null, []],
    tipoPolin: [null, []],
    estado: [null, []],
    codigoSap: [null, []],
    estacionId: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private estacionService: EstacionService,
    private polinService: PolinService,
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.estacionService.query().subscribe(
      data => {
        this.estacions = data.body;
      },
      error => this.onError(error),
    );
    this.activatedRoute.data.subscribe(response => {
      this.polin = response.data;
      this.isNew = this.polin.id === null || this.polin.id === undefined;
      this.updateForm(this.polin);
    });
  }

  updateForm(polin: Polin) {
    this.form.patchValue({
      id: polin.id,
      identificador: polin.identificador,
      descripcion: polin.descripcion,
      posicionPolin: polin.posicionPolin,
      tipoPolin: polin.tipoPolin,
      estado: polin.estado,
      codigoSap: polin.codigoSap,
    });
  }

  save() {
    this.isSaving = true;
    const polin = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.polinService.update(polin));
    } else {
      this.subscribeToSaveResponse(this.polinService.create(polin));
    }
  }

  async onSaveSuccess(response) {
    let action = 'actualizado';
    if (response.status === 201) {
      action = 'creado';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Registro ${action} correctamente.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/polin');
  }

  previousState() {
    window.history.back();
  }

  async onError(error) {
    this.isSaving = false;
    console.error(error);
    const toast = await this.toastCtrl.create({ message: 'No se pudieron cargar los datos', duration: 2000, position: 'middle' });
    await toast.present();
  }

  compareEstacion(first: Estacion, second: Estacion): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackEstacionById(index: number, item: Estacion) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Polin>>) {
    result.subscribe(
      (res: HttpResponse<Polin>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error),
    );
  }

  private createFromForm(): Polin {
    return {
      ...new Polin(),
      id: this.form.get(['id']).value,
      identificador: this.form.get(['identificador']).value,
      descripcion: this.form.get(['descripcion']).value,
      posicionPolin: this.form.get(['posicionPolin']).value,
      tipoPolin: this.form.get(['tipoPolin']).value,
      estado: this.form.get(['estado']).value,
      codigoSap: this.form.get(['codigoSap']).value,
    };
  }
}
