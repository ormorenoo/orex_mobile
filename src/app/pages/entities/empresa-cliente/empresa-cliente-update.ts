import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder as FormBuilder } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { EmpresaCliente } from './empresa-cliente.model';
import { EmpresaClienteService } from './empresa-cliente.service';

@Component({
  selector: 'page-empresa-cliente-update',
  templateUrl: 'empresa-cliente-update.html',
})
export class EmpresaClienteUpdatePage implements OnInit {
  empresaCliente: EmpresaCliente;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = inject(FormBuilder).group({
    id: [null, []],
    rut: [null, []],
    razonSocial: [null, []],
    direccion: [null, []],
    telefono: [null, []],
    nombreContacto: [null, []],
    correo: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private empresaClienteService: EmpresaClienteService,
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(response => {
      this.empresaCliente = response.data;
      this.isNew = this.empresaCliente.id === null || this.empresaCliente.id === undefined;
      this.updateForm(this.empresaCliente);
    });
  }

  updateForm(empresaCliente: EmpresaCliente) {
    this.form.patchValue({
      id: empresaCliente.id,
      rut: empresaCliente.rut,
      razonSocial: empresaCliente.razonSocial,
      direccion: empresaCliente.direccion,
      telefono: empresaCliente.telefono,
      nombreContacto: empresaCliente.nombreContacto,
      correo: empresaCliente.correo,
    });
  }

  save() {
    this.isSaving = true;
    const empresaCliente = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.empresaClienteService.update(empresaCliente));
    } else {
      this.subscribeToSaveResponse(this.empresaClienteService.create(empresaCliente));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `EmpresaCliente ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/empresa-cliente');
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<EmpresaCliente>>) {
    result.subscribe(
      (res: HttpResponse<EmpresaCliente>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error),
    );
  }

  private createFromForm(): EmpresaCliente {
    return {
      ...new EmpresaCliente(),
      id: this.form.get(['id']).value,
      rut: this.form.get(['rut']).value,
      razonSocial: this.form.get(['razonSocial']).value,
      direccion: this.form.get(['direccion']).value,
      telefono: this.form.get(['telefono']).value,
      nombreContacto: this.form.get(['nombreContacto']).value,
      correo: this.form.get(['correo']).value,
    };
  }
}
