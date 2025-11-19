import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder as FormBuilder } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ClienteMandante, ClienteMandanteService } from '../cliente-mandante';
import { Faena } from './faena.model';
import { FaenaService } from './faena.service';

@Component({
  selector: 'page-faena-update',
  templateUrl: 'faena-update.html',
})
export class FaenaUpdatePage implements OnInit {
  faena: Faena;
  clienteMandantes: ClienteMandante[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = inject(FormBuilder).group({
    id: [null, []],
    nombre: [null, []],
    clienteMandanteId: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private clienteMandanteService: ClienteMandanteService,
    private faenaService: FaenaService,
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.clienteMandanteService.query().subscribe(
      data => {
        this.clienteMandantes = data.body;
      },
      error => this.onError(error),
    );
    this.activatedRoute.data.subscribe(response => {
      this.faena = response.data;
      this.isNew = this.faena.id === null || this.faena.id === undefined;
      this.updateForm(this.faena);
    });
  }

  updateForm(faena: Faena) {
    this.form.patchValue({
      id: faena.id,
      nombre: faena.nombre,
      clienteMandanteId: faena.clienteMandanteId,
    });
  }

  save() {
    this.isSaving = true;
    const faena = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.faenaService.update(faena));
    } else {
      this.subscribeToSaveResponse(this.faenaService.create(faena));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Faena ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/faena');
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

  compareClienteMandante(first: ClienteMandante, second: ClienteMandante): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackClienteMandanteById(index: number, item: ClienteMandante) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Faena>>) {
    result.subscribe(
      (res: HttpResponse<Faena>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error),
    );
  }

  private createFromForm(): Faena {
    return {
      ...new Faena(),
      id: this.form.get(['id']).value,
      nombre: this.form.get(['nombre']).value,
      clienteMandanteId: this.form.get(['clienteMandanteId']).value,
    };
  }
}
