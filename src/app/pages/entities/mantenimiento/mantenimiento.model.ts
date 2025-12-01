import { BaseEntity } from 'src/model/base-entity';
import { Polin } from '../polin';
import { Inspeccion } from '../inspeccion';
import { ApplicationUser } from '../application-user/application-user.model';

export const enum CondicionPolin {
  'OPERATIVO',
  'NO_OPERATIVO',
  'OBSERVACION',
}

export class Mantenimiento implements BaseEntity {
  constructor(
    public id?: number,
    public fechaCreacion?: any,
    public condicionPolin?: CondicionPolin,
    public rutaFotoGeneral?: string,
    public rutaFotoDetallePolin?: string,
    public polin?: Polin,
    public inspeccion?: Inspeccion,
    public applicationUser?: ApplicationUser,
  ) {}
}
