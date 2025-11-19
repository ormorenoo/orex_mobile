import { BaseEntity } from 'src/model/base-entity';

export const enum CondicionPolin {
  'OPERATIVO',
  'NO_OPERATIVO',
  'OBSERVACION',
}

export class Mantenimiento implements BaseEntity {
  constructor(
    public id?: number,
    public fechaCreacion?: any,
    public condicionPolin?: CondicionPolin,
    public rutaFotoGeneral?: string,
    public rutaFotoDetallePolin?: string,
    public polinundefined?: string,
    public polinId?: number,
    public inspeccionundefined?: string,
    public inspeccionId?: number,
  ) {}
}
