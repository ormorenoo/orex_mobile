import { BaseEntity } from 'src/model/base-entity';
import { Polin } from '#app/pages/entities/polin/polin.model';
import { MesaTrabajo } from '../mesa-trabajo';

export const enum TipoEstacion {
  'CARGA',
  'RETORNO',
  'IMPACTO',
}

export const enum TipoEstacionPolin {
  'ARTESA_3_RODILLOS',
  'ARTESA_5_RODILLOS',
  'IMPACTO_3_RODILLOS',
  'IMPACTO_5_RODILLOS',
  'RETORNO_UNICO',
  'RETORNO_V_INVERTIDA',
  'ALINEAMIENTO_CARGA',
  'ALINEAMIENTO_RETORNO',
  'TRANSICION',
}

export const enum Estado {
  'OPERATIVO',
  'OBSERVACION',
  'NO_OPERATIVO',
}

export class Estacion implements BaseEntity {
  constructor(
    public id?: number,
    public identificador?: string,
    public mesaTrabajo?: MesaTrabajo,
  ) {}
}
