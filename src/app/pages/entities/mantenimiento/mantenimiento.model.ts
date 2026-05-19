import { BaseEntity } from 'src/model/base-entity';
import { Polin } from '../polin';
import { Inspeccion } from '../inspeccion';
import { ApplicationUser } from '../application-user/application-user.model';

export const enum CondicionPolin {
  'OPERATIVO',
  'NO_OPERATIVO',
  'OBSERVACION',
}

export const enum TipoFalla {
  'CARGA_ACUMULADA',
  'DESBOCADO',
  'DANIADO',
  'DESGASTADO',
  'TRABADO',
  'INADECUADO',
  'DIAMETRO_INCORRECTO',
  'OXIDADO',
}

export const enum TipoServicio {
  'OUTAGE',
  'SHUT_DOWN',
  'WEEKEND',
}

export class Mantenimiento implements BaseEntity {
  constructor(
    public id?: number,
    public idLocal?: string,
    public fechaCreacion?: any,
    public condicionPolin?: CondicionPolin,
    public tipoFalla?: TipoFalla,
    public tipoServicio?: TipoServicio,
    public rutaFotoGeneral?: string,
    public rutaFotoDetallePolin?: string,
    public polin?: Polin,
    public inspeccion?: Inspeccion,
    public applicationUser?: ApplicationUser,
  ) {}
}
