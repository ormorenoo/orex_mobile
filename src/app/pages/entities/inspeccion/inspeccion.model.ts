import { BaseEntity } from 'src/model/base-entity';
import { Mantenimiento } from '#app/pages/entities/mantenimiento/mantenimiento.model';

export const enum CondicionPolin {
  'OPERATIVO',
  'NO_OPERATIVO',
  'OBSERVACION',
}

export const enum Criticidad {
  'INMEDIATO',
  'URGENTE',
  'PLANIFICADO',
}

export const enum Observacion {
  'DESGASTE',
  'DANIO',
  'OXIDACION',
  'BLOQUEADO',
  'DESALINEADO',
}

export class Inspeccion implements BaseEntity {
  constructor(
    public id?: number,
    public fechaCreacion?: any,
    public condicionPolin?: CondicionPolin,
    public criticidad?: Criticidad,
    public observacion?: Observacion,
    public comentarios?: string,
    public rutaFotoGeneral?: string,
    public rutaFotoDetallePolin?: string,
    public polinundefined?: string,
    public polinId?: number,
    public mantenimientos?: Mantenimiento[],
  ) {}
}
