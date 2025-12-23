import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder as FormBuilder } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Area, AreaService } from '../area';
import { Faena, FaenaService } from '../faena';
import { AreaFaena } from './area-faena.model';
import { AreaFaenaService } from './area-faena.service';

@Component({
  selector: 'page-area-faena-update',
  templateUrl: 'area-faena-update.html',
})
export class AreaFaenaUpdatePage implements OnInit {
  areaFaena: AreaFaena;
  areas: Area[];
  faenas: Faena[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = inject(FormBuilder).group({
    id: [null, []],
    areaId: [null, []],
    faenaId: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private areaService: AreaService,
    private faenaService: FaenaService,
    private areaFaenaService: AreaFaenaService,
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.areaService.query().subscribe(
      data => {
        this.areas = data.body;
      },
      error => this.onError(error),
    );
    this.faenaService.query().subscribe(
      data => {
        this.faenas = data.body;
      },
      error => this.onError(error),
    );
    this.activatedRoute.data.subscribe(response => {
      this.areaFaena = response.data;
      this.isNew = this.areaFaena.id === null || this.areaFaena.id === undefined;
      this.updateForm(this.areaFaena);
    });
  }

  updateForm(areaFaena: AreaFaena) {
    this.form.patchValue({
      id: areaFaena.id,
    });
  }

  save() {
    this.isSaving = true;
    const areaFaena = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.areaFaenaService.update(areaFaena));
    } else {
      this.subscribeToSaveResponse(this.areaFaenaService.create(areaFaena));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `AreaFaena ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/area-faena');
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

  compareArea(first: Area, second: Area): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackAreaById(index: number, item: Area) {
    return item.id;
  }
  compareFaena(first: Faena, second: Faena): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackFaenaById(index: number, item: Faena) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<AreaFaena>>) {
    result.subscribe(
      (res: HttpResponse<AreaFaena>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error),
    );
  }

  private createFromForm(): AreaFaena {
    return {
      ...new AreaFaena(),
      id: this.form.get(['id']).value,
    };
  }
}
