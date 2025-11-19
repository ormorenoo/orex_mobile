import { BaseEntity } from 'src/model/base-entity';

export class EmpresaCliente implements BaseEntity {
  constructor(
    public id?: number,
    public rut?: string,
    public razonSocial?: string,
    public direccion?: string,
    public telefono?: string,
    public nombreContacto?: string,
    public correo?: string,
  ) {}
}
