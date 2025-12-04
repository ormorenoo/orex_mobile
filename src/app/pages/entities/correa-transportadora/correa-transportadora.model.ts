import { BaseEntity } from 'src/model/base-entity';
import { MesaTrabajo } from '#app/pages/entities/mesa-trabajo/mesa-trabajo.model';
import { AreaFaena } from '../area-faena';

export class CorreaTransportadora implements BaseEntity {
  constructor(
    public id?: number,
    public tagId?: string,
    public descripcion?: string,
    public areaFaenaundefined?: string,
    public areaFaenaId?: number,
    public mesaTrabajos?: MesaTrabajo[],
    public areaFaena?: AreaFaena[],
  ) {}
}
