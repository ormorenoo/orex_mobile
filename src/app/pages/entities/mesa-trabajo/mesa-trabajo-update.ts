import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder as FormBuilder } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CorreaTransportadora, CorreaTransportadoraService } from '../correa-transportadora';
import { MesaTrabajo } from './mesa-trabajo.model';
import { MesaTrabajoService } from './mesa-trabajo.service';

@Component({
  selector: 'page-mesa-trabajo-update',
  templateUrl: 'mesa-trabajo-update.html',
})
export class MesaTrabajoUpdatePage implements OnInit {
  mesaTrabajo: MesaTrabajo;
  correaTransportadoras: CorreaTransportadora[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = inject(FormBuilder).group({
    id: [null, []],
    identificador: [null, []],
    descripcion: [null, []],
    tipo: [null, []],
    correaTransportadoraId: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private correaTransportadoraService: CorreaTransportadoraService,
    private mesaTrabajoService: MesaTrabajoService,
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.correaTransportadoraService.query().subscribe(
      data => {
        this.correaTransportadoras = data.body;
      },
      error => this.onError(error),
    );
    this.activatedRoute.data.subscribe(response => {
      this.mesaTrabajo = response.data;
      this.isNew = this.mesaTrabajo.id === null || this.mesaTrabajo.id === undefined;
      this.updateForm(this.mesaTrabajo);
    });
  }

  updateForm(mesaTrabajo: MesaTrabajo) {
    this.form.patchValue({
      id: mesaTrabajo.id,
      identificador: mesaTrabajo.identificador,
      descripcion: mesaTrabajo.descripcion,
      tipo: mesaTrabajo.tipo,
      correaTransportadoraId: mesaTrabajo.correaTransportadoraId,
    });
  }

  save() {
    this.isSaving = true;
    const mesaTrabajo = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.mesaTrabajoService.update(mesaTrabajo));
    } else {
      this.subscribeToSaveResponse(this.mesaTrabajoService.create(mesaTrabajo));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `MesaTrabajo ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/mesa-trabajo');
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

  compareCorreaTransportadora(first: CorreaTransportadora, second: CorreaTransportadora): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackCorreaTransportadoraById(index: number, item: CorreaTransportadora) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<MesaTrabajo>>) {
    result.subscribe(
      (res: HttpResponse<MesaTrabajo>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error),
    );
  }

  private createFromForm(): MesaTrabajo {
    return {
      ...new MesaTrabajo(),
      id: this.form.get(['id']).value,
      identificador: this.form.get(['identificador']).value,
      descripcion: this.form.get(['descripcion']).value,
      tipo: this.form.get(['tipo']).value,
      correaTransportadoraId: this.form.get(['correaTransportadoraId']).value,
    };
  }
}
