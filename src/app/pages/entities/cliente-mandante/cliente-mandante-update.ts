import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder as FormBuilder } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ClienteMandante } from './cliente-mandante.model';
import { ClienteMandanteService } from './cliente-mandante.service';

@Component({
  selector: 'page-cliente-mandante-update',
  templateUrl: 'cliente-mandante-update.html',
})
export class ClienteMandanteUpdatePage implements OnInit {
  clienteMandante: ClienteMandante;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = inject(FormBuilder).group({
    id: [null, []],
    rut: [null, []],
    razonSocial: [null, []],
    direccion: [null, []],
    nombreContacto: [null, []],
    telefono: [null, []],
    correo: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private clienteMandanteService: ClienteMandanteService,
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(response => {
      this.clienteMandante = response.data;
      this.isNew = this.clienteMandante.id === null || this.clienteMandante.id === undefined;
      this.updateForm(this.clienteMandante);
    });
  }

  updateForm(clienteMandante: ClienteMandante) {
    this.form.patchValue({
      id: clienteMandante.id,
      rut: clienteMandante.rut,
      razonSocial: clienteMandante.razonSocial,
      direccion: clienteMandante.direccion,
      nombreContacto: clienteMandante.nombreContacto,
      telefono: clienteMandante.telefono,
      correo: clienteMandante.correo,
    });
  }

  save() {
    this.isSaving = true;
    const clienteMandante = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.clienteMandanteService.update(clienteMandante));
    } else {
      this.subscribeToSaveResponse(this.clienteMandanteService.create(clienteMandante));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `ClienteMandante ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/cliente-mandante');
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ClienteMandante>>) {
    result.subscribe(
      (res: HttpResponse<ClienteMandante>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error),
    );
  }

  private createFromForm(): ClienteMandante {
    return {
      ...new ClienteMandante(),
      id: this.form.get(['id']).value,
      rut: this.form.get(['rut']).value,
      razonSocial: this.form.get(['razonSocial']).value,
      direccion: this.form.get(['direccion']).value,
      nombreContacto: this.form.get(['nombreContacto']).value,
      telefono: this.form.get(['telefono']).value,
      correo: this.form.get(['correo']).value,
    };
  }
}
