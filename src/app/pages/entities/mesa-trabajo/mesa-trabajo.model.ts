import { BaseEntity } from 'src/model/base-entity';
import { CorreaTransportadora } from '../correa-transportadora';

export const enum TipoMesa {
  'MESA_UNO',
  'MESA_DOS',
}

export class MesaTrabajo implements BaseEntity {
  constructor(
    public id?: number,
    public identificador?: string,
    public correaTransportadora?: CorreaTransportadora,
  ) {}
}
