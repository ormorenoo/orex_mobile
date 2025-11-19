import { BaseEntity } from 'src/model/base-entity';
import { AreaFaena } from '#app/pages/entities/area-faena/area-faena.model';

export class Area implements BaseEntity {
  constructor(
    public id?: number,
    public nombre?: string,
    public areaFaenas?: AreaFaena[],
  ) {}
}
