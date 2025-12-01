import { BaseEntity } from 'src/model/base-entity';
import { EmpresaCliente } from '../empresa-cliente';

export class ApplicationUser implements BaseEntity {
  constructor(
    public id?: number,
    public login?: string,
    public secondLastName?: string,
    public cedula?: string,
    public cargo?: string,
    public telefono?: string,
    public empresasCliente?: EmpresaCliente[],
  ) {}
}
