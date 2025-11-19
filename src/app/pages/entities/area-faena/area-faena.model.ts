import { BaseEntity } from 'src/model/base-entity';
import { CorreaTransportadora } from '#app/pages/entities/correa-transportadora/correa-transportadora.model';

export class AreaFaena implements BaseEntity {
  constructor(
    public id?: number,
    public areaundefined?: string,
    public areaId?: number,
    public faenaundefined?: string,
    public faenaId?: number,
    public correaTransportadoras?: CorreaTransportadora[],
  ) {}
}
