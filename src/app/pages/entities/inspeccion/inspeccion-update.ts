import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder as FormBuilder } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Polin, PolinService } from '../polin';
import { Inspeccion } from './inspeccion.model';
import { InspeccionService } from './inspeccion.service';

@Component({
  selector: 'page-inspeccion-update',
  templateUrl: 'inspeccion-update.html',
})
export class InspeccionUpdatePage implements OnInit {
  inspeccion: Inspeccion;
  polins: Polin[];
  fechaCreacion: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = inject(FormBuilder).group({
    id: [null, []],
    fechaCreacion: [null, []],
    condicionPolin: [null, []],
    criticidad: [null, []],
    observacion: [null, []],
    comentarios: [null, []],
    rutaFotoGeneral: [null, []],
    rutaFotoDetallePolin: [null, []],
    polinId: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private polinService: PolinService,
    private inspeccionService: InspeccionService,
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.polinService.query().subscribe(
      data => {
        this.polins = data.body;
      },
      error => this.onError(error),
    );
    this.activatedRoute.data.subscribe(response => {
      this.inspeccion = response.data;
      this.isNew = this.inspeccion.id === null || this.inspeccion.id === undefined;
      this.updateForm(this.inspeccion);
    });
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
      polinId: inspeccion.polinId,
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

  comparePolin(first: Polin, second: Polin): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackPolinById(index: number, item: Polin) {
    return item.id;
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
      polinId: this.form.get(['polinId']).value,
    };
  }
}
