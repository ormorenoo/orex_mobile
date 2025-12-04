import { BaseEntity } from 'src/model/base-entity';
import { CorreaTransportadora } from '#app/pages/entities/correa-transportadora/correa-transportadora.model';
import { Area } from '../area/area.model';
import { Faena } from '../faena';

export class AreaFaena implements BaseEntity {
  constructor(
    public id?: number,
    public areaundefined?: string,
    public areaId?: number,
    public area?: Area,
    public faenaundefined?: string,
    public faenaId?: number,
    public faena?: Faena,
    public correaTransportadoras?: CorreaTransportadora[],
  ) {}
}
