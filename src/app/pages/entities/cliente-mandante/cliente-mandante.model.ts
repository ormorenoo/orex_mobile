import { BaseEntity } from 'src/model/base-entity';
import { Faena } from '#app/pages/entities/faena/faena.model';

export class ClienteMandante implements BaseEntity {
  constructor(
    public id?: number,
    public rut?: string,
    public razonSocial?: string,
    public direccion?: string,
    public nombreContacto?: string,
    public telefono?: string,
    public correo?: string,
    public faenas?: Faena[],
  ) {}
}
