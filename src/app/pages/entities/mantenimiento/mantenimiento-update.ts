import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder as FormBuilder } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Polin, PolinService } from '../polin';
import { Inspeccion, InspeccionService } from '../inspeccion';
import { Mantenimiento } from './mantenimiento.model';
import { MantenimientoService } from './mantenimiento.service';

@Component({
  selector: 'page-mantenimiento-update',
  templateUrl: 'mantenimiento-update.html',
})
export class MantenimientoUpdatePage implements OnInit {
  mantenimiento: Mantenimiento;
  polins: Polin[];
  inspeccions: Inspeccion[];
  fechaCreacion: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = inject(FormBuilder).group({
    id: [null, []],
    fechaCreacion: [null, []],
    condicionPolin: [null, []],
    rutaFotoGeneral: [null, []],
    rutaFotoDetallePolin: [null, []],
    polinId: [null, []],
    inspeccionId: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private polinService: PolinService,
    private inspeccionService: InspeccionService,
    private mantenimientoService: MantenimientoService,
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
    this.inspeccionService.query().subscribe(
      data => {
        this.inspeccions = data.body;
      },
      error => this.onError(error),
    );
    this.activatedRoute.data.subscribe(response => {
      this.mantenimiento = response.data;
      this.isNew = this.mantenimiento.id === null || this.mantenimiento.id === undefined;
      this.updateForm(this.mantenimiento);
    });
  }

  updateForm(mantenimiento: Mantenimiento) {
    this.form.patchValue({
      id: mantenimiento.id,
      fechaCreacion: this.isNew ? new Date().toISOString() : mantenimiento.fechaCreacion,
      condicionPolin: mantenimiento.condicionPolin,
      rutaFotoGeneral: mantenimiento.rutaFotoGeneral,
      rutaFotoDetallePolin: mantenimiento.rutaFotoDetallePolin,
      polinId: mantenimiento.polinId,
      inspeccionId: mantenimiento.inspeccionId,
    });
  }

  save() {
    this.isSaving = true;
    const mantenimiento = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.mantenimientoService.update(mantenimiento));
    } else {
      this.subscribeToSaveResponse(this.mantenimientoService.create(mantenimiento));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Mantenimiento ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/mantenimiento');
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
  compareInspeccion(first: Inspeccion, second: Inspeccion): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackInspeccionById(index: number, item: Inspeccion) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Mantenimiento>>) {
    result.subscribe(
      (res: HttpResponse<Mantenimiento>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error),
    );
  }

  private createFromForm(): Mantenimiento {
    return {
      ...new Mantenimiento(),
      id: this.form.get(['id']).value,
      fechaCreacion: new Date(this.form.get(['fechaCreacion']).value),
      condicionPolin: this.form.get(['condicionPolin']).value,
      rutaFotoGeneral: this.form.get(['rutaFotoGeneral']).value,
      rutaFotoDetallePolin: this.form.get(['rutaFotoDetallePolin']).value,
      polinId: this.form.get(['polinId']).value,
      inspeccionId: this.form.get(['inspeccionId']).value,
    };
  }
}
