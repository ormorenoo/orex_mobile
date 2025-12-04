import { BaseEntity } from 'src/model/base-entity';
import { AreaFaena } from '#app/pages/entities/area-faena/area-faena.model';
import { Faena } from '../faena/faena.model';

export class Area implements BaseEntity {
  constructor(
    public id?: number,
    public nombre?: string,
    public areaFaenas?: AreaFaena[],
    public faenas?: Faena[],
  ) {}
}
