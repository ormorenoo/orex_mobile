import { AbstractControl } from '@angular/forms';

import { MesaTrabajo } from '#app/pages/entities/mesa-trabajo/mesa-trabajo.model';
import { Estacion } from '#app/pages/entities/estacion/estacion.model';
import { Polin } from '#app/pages/entities/polin/polin.model';

/**
 * Deshabilita en bloque los controles de ubicación recibidos.
 * Evita repetir `control.disable()` en cada rama de `handleQueryParams`.
 * Espejo de orex/src/main/webapp/app/shared/utils/ubicacion.utils.ts.
 */
export function bloquearControles(...controles: (AbstractControl | null | undefined)[]): void {
  controles.forEach(control => control?.disable());
}

/** Cascada faena → área → correa → mesa a partir de una mesa (puede venir nula). */
function cascadaDesdeMesa(mesa: MesaTrabajo | null | undefined): Record<string, any> {
  return {
    faena: mesa?.correaTransportadora?.areaFaena?.faena,
    area: mesa?.correaTransportadora?.areaFaena?.area,
    correa: mesa?.correaTransportadora,
    mesa,
  };
}

/** Valores de ubicación a pre-cargar cuando se crea el registro desde una mesa. */
export function ubicacionDesdeMesa(mesa: MesaTrabajo): Record<string, any> {
  return cascadaDesdeMesa(mesa);
}

/** Valores de ubicación a pre-cargar cuando se crea el registro desde una estación. */
export function ubicacionDesdeEstacion(estacion: Estacion): Record<string, any> {
  return {
    ...cascadaDesdeMesa(estacion.mesaTrabajo),
    estacion,
  };
}

/** Valores de ubicación a pre-cargar cuando se crea el registro desde un polín. */
export function ubicacionDesdePolin(polin: Polin): Record<string, any> {
  return {
    ...cascadaDesdeMesa(polin.estacion?.mesaTrabajo),
    estacion: polin.estacion,
    polin,
  };
}

/** Resumen legible de la ubicación autocompletada, para la tarjeta del formulario. */
export interface ResumenUbicacion {
  faena?: string;
  area?: string;
  correa?: string;
  mesa?: string;
  estacion?: string;
  polin?: string;
}

export function resumenUbicacion(valores: Record<string, any>): ResumenUbicacion {
  return {
    faena: valores['faena']?.nombre,
    area: valores['area']?.nombre,
    correa: valores['correa']?.tagId,
    mesa: valores['mesa']?.identificador,
    estacion: valores['estacion']?.identificador,
    polin: valores['polin']?.identificador,
  };
}
