import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder as FormBuilder } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MesaTrabajo, MesaTrabajoService } from '../mesa-trabajo';
import { Estacion } from './estacion.model';
import { EstacionService } from './estacion.service';

@Component({
  selector: 'page-estacion-update',
  templateUrl: 'estacion-update.html',
})
export class EstacionUpdatePage implements OnInit {
  estacion: Estacion;
  mesaTrabajos: MesaTrabajo[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = inject(FormBuilder).group({
    id: [null, []],
    identificador: [null, []],
    descripcion: [null, []],
    tipoEstacion: [null, []],
    tipoEstacionPolin: [null, []],
    estado: [null, []],
    mesaTrabajoId: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private mesaTrabajoService: MesaTrabajoService,
    private estacionService: EstacionService,
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.mesaTrabajoService.query().subscribe(
      data => {
        this.mesaTrabajos = data.body;
      },
      error => this.onError(error),
    );
    this.activatedRoute.data.subscribe(response => {
      this.estacion = response.data;
      this.isNew = this.estacion.id === null || this.estacion.id === undefined;
      this.updateForm(this.estacion);
    });
  }

  updateForm(estacion: Estacion) {
    this.form.patchValue({
      id: estacion.id,
      identificador: estacion.identificador,
    });
  }

  save() {
    this.isSaving = true;
    const estacion = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.estacionService.update(estacion));
    } else {
      this.subscribeToSaveResponse(this.estacionService.create(estacion));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Estacion ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/estacion');
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

  compareMesaTrabajo(first: MesaTrabajo, second: MesaTrabajo): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackMesaTrabajoById(index: number, item: MesaTrabajo) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Estacion>>) {
    result.subscribe(
      (res: HttpResponse<Estacion>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error),
    );
  }

  private createFromForm(): Estacion {
    return {
      ...new Estacion(),
      id: this.form.get(['id']).value,
      identificador: this.form.get(['identificador']).value,
    };
  }
}
