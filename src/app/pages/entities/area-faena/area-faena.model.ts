import { BaseEntity } from 'src/model/base-entity';
import { CorreaTransportadora } from '#app/pages/entities/correa-transportadora/correa-transportadora.model';
import { Area } from '../area/area.model';
import { Faena } from '../faena';

export class AreaFaena implements BaseEntity {
  constructor(
    public id?: number,
    public area?: Area,
    public faena?: Faena,
  ) {}
}
