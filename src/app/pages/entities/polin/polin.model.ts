import { BaseEntity } from 'src/model/base-entity';
import { Inspeccion } from '#app/pages/entities/inspeccion/inspeccion.model';
import { Mantenimiento } from '#app/pages/entities/mantenimiento/mantenimiento.model';
import { Estacion } from '../estacion';

export const enum PosicionPolin {
  'UNICO',
  'CENTRAL',
  'CENTRAL_DERECHO',
  'CENTRAL_IZQUIERDO',
  'DERECHO',
  'IZQUIERDO',
}

export const enum TipoPolin {
  'CARGA',
  'RETORNO',
  'IMPACTO',
  'POLEA',
  'PESOMETRICO',
  'AUTOLINEANTE',
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
    public posicionPolin?: PosicionPolin,
    public tipoPolin?: TipoPolin,
    public estado?: Estado,
    public codigoSap?: string,
    public estacion?: Estacion,
  ) {}
}
