import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder as FormBuilder } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AreaFaena, AreaFaenaService } from '../area-faena';
import { CorreaTransportadora } from './correa-transportadora.model';
import { CorreaTransportadoraService } from './correa-transportadora.service';

@Component({
  selector: 'page-correa-transportadora-update',
  templateUrl: 'correa-transportadora-update.html',
})
export class CorreaTransportadoraUpdatePage implements OnInit {
  correaTransportadora: CorreaTransportadora;
  areaFaenas: AreaFaena[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = inject(FormBuilder).group({
    id: [null, []],
    tagId: [null, []],
    descripcion: [null, []],
    areaFaenaId: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private areaFaenaService: AreaFaenaService,
    private correaTransportadoraService: CorreaTransportadoraService,
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.areaFaenaService.query().subscribe(
      data => {
        this.areaFaenas = data.body;
      },
      error => this.onError(error),
    );
    this.activatedRoute.data.subscribe(response => {
      this.correaTransportadora = response.data;
      this.isNew = this.correaTransportadora.id === null || this.correaTransportadora.id === undefined;
      this.updateForm(this.correaTransportadora);
    });
  }

  updateForm(correaTransportadora: CorreaTransportadora) {
    this.form.patchValue({
      id: correaTransportadora.id,
      tagId: correaTransportadora.tagId,
    });
  }

  save() {
    this.isSaving = true;
    const correaTransportadora = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.correaTransportadoraService.update(correaTransportadora));
    } else {
      this.subscribeToSaveResponse(this.correaTransportadoraService.create(correaTransportadora));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({
      message: `CorreaTransportadora ${action} successfully.`,
      duration: 2000,
      position: 'middle',
    });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/correa-transportadora');
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

  compareAreaFaena(first: AreaFaena, second: AreaFaena): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackAreaFaenaById(index: number, item: AreaFaena) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<CorreaTransportadora>>) {
    result.subscribe(
      (res: HttpResponse<CorreaTransportadora>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error),
    );
  }

  private createFromForm(): CorreaTransportadora {
    return {
      ...new CorreaTransportadora(),
      id: this.form.get(['id']).value,
      tagId: this.form.get(['tagId']).value,
    };
  }
}
