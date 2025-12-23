import { BaseEntity } from 'src/model/base-entity';
import { AreaFaena } from '../area-faena';

export class CorreaTransportadora implements BaseEntity {
  constructor(
    public id?: number,
    public tagId?: string,
    public areaFaena?: AreaFaena,
  ) {}
}
