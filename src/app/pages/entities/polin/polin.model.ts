import { BaseEntity } from 'src/model/base-entity';
import { Inspeccion } from '#app/pages/entities/inspeccion/inspeccion.model';
import { Mantenimiento } from '#app/pages/entities/mantenimiento/mantenimiento.model';

export const enum TipoPolin {
  'UNICO',
  'CENTRAL',
  'CENTRAL_DERECHO',
  'CENTRAL_IZQUIERDO',
  'DERECHO',
  'IZQUIERDO',
}

export const enum Estado {
  'OPERATIVO',
  'OBSERVACION',
  'NO_OPERATIVO',
}

export class Polin implements BaseEntity {
  constructor(
    public id?: number,
    public identificador?: string,
    public descripcion?: string,
    public tipoPolin?: TipoPolin,
    public estado?: Estado,
    public estacionundefined?: string,
    public estacionId?: number,
    public inspeccions?: Inspeccion[],
    public mantenimientos?: Mantenimiento[],
  ) {}
}
