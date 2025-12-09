import { BaseEntity } from 'src/model/base-entity';
import { EmpresaCliente } from '../empresa-cliente';

export class ApplicationUser implements BaseEntity {
  constructor(
    public id?: number,
    public login?: string,
    public firstName?: string,
    public lastName?: string,
    public secondLastName?: string,
    public email?: string,
    public cedula?: string,
    public cargo?: string,
    public telefono?: string,
    public empresasCliente?: EmpresaCliente[],
  ) {}
}
