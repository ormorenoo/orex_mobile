import { BaseEntity } from 'src/model/base-entity';
import { Mantenimiento } from '#app/pages/entities/mantenimiento/mantenimiento.model';
import { Polin } from '../polin';
import { Estacion } from '../estacion';
import { TipoRegistro } from '../enumerations/tipo-registro.model';
import { ApplicationUser } from '../application-user/application-user.model';

export const enum Condicion {
  'OPERATIVO',
  'NO_OPERATIVO',
  'OBSERVACION',
  'SIN_ESTADO',
}

export const enum Criticidad {
  'INMEDIATO',
  'URGENTE',
  'PLANIFICADO',
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

export class Inspeccion implements BaseEntity {
  constructor(
    public id?: number,
    public idLocal?: string,
    public fechaCreacion?: any,
    public condicion?: Condicion,
    public criticidad?: Criticidad,
    public tipoFalla?: TipoFalla,
    public tipoServicio?: TipoServicio,
    public comentarios?: string,
    public rutaFotoGeneral?: string,
    public rutaFotoDetalle?: string,
    public polin?: Polin,
    public mantenimientos?: Mantenimiento[],
    public applicationUser?: ApplicationUser,
    public tipo?: TipoRegistro,
    public estacion?: Estacion,
  ) {}
}
