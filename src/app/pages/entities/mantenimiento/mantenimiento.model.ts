import { BaseEntity } from 'src/model/base-entity';
import { Polin } from '../polin';
import { Inspeccion } from '../inspeccion';
import { Estacion } from '../estacion';
import { TipoRegistro } from '../enumerations/tipo-registro.model';
import { ApplicationUser } from '../application-user/application-user.model';

export const enum Condicion {
  'OPERATIVO',
  'NO_OPERATIVO',
  'OBSERVACION',
  'SIN_ESTADO',
}

export const enum TipoFalla {
  'DESGASTE',
  'DANIO',
  'OXIDACION',
  'BLOQUEADO',
  'DESALINEADO',
  'CON_CARGA_ACUMULADA',
  'CON_RUIDO_Y_GOLPETEO',
  'CON_TEMPERATURA',
  'DE_IMPACTO_SIN_REVESTIMIENTO',
  'DESBOCADO',
  'DESGASTADO',
  'DIAMETRO_INCORRECTO',
  'INADECUADO',
  'INEXISTENTE',
  'TRABADO',
}

export const enum TipoServicio {
  'OUTAGE',
  'SHUT_DOWN',
  'WEEKEND',
}

export const enum TipoMantenimiento {
  'CAMBIO',
  'REPARACION',
}

export class Mantenimiento implements BaseEntity {
  constructor(
    public id?: number,
    public idLocal?: string,
    public fechaCreacion?: any,
    public condicion?: Condicion,
    public tipoFalla?: TipoFalla,
    public tipoServicio?: TipoServicio,
    public tipoMantenimiento?: TipoMantenimiento,
    public rutaFotoGeneral?: string,
    public rutaFotoDetalle?: string,
    public comentarios?: string,
    public polin?: Polin,
    public inspeccion?: Inspeccion,
    public applicationUser?: ApplicationUser,
    public tipo?: TipoRegistro,
    public estacion?: Estacion,
  ) {}
}
