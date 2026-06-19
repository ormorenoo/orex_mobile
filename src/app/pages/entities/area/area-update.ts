import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder as FormBuilder } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Area } from './area.model';
import { AreaService } from './area.service';

@Component({
  selector: 'page-area-update',
  templateUrl: 'area-update.html',
  styleUrl: 'area-update.scss',
})
export class AreaUpdatePage implements OnInit {
  area: Area;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = inject(FormBuilder).group({
    id: [null, []],
    nombre: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private areaService: AreaService,
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(response => {
      this.area = response.data;
      this.isNew = this.area.id === null || this.area.id === undefined;
      this.updateForm(this.area);
    });
  }

  updateForm(area: Area) {
    this.form.patchValue({
      id: area.id,
      nombre: area.nombre,
    });
  }

  save() {
    this.isSaving = true;
    const area = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.areaService.update(area));
    } else {
      this.subscribeToSaveResponse(this.areaService.create(area));
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
    await this.navController.navigateBack('/tabs/entities/area');
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Area>>) {
    result.subscribe(
      (res: HttpResponse<Area>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error),
    );
  }

  private createFromForm(): Area {
    return {
      ...new Area(),
      id: this.form.get(['id']).value,
      nombre: this.form.get(['nombre']).value,
    };
  }
}
