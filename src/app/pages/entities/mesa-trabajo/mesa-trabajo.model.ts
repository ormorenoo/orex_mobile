import { BaseEntity } from 'src/model/base-entity';
import { Estacion } from '#app/pages/entities/estacion/estacion.model';

export const enum TipoMesa {
  'MESA_UNO',
  'MESA_DOS',
}

export class MesaTrabajo implements BaseEntity {
  constructor(
    public id?: number,
    public identificador?: string,
    public descripcion?: string,
    public tipo?: TipoMesa,
    public correaTransportadoraundefined?: string,
    public correaTransportadoraId?: number,
    public estacions?: Estacion[],
  ) {}
}
