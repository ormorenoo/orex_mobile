/**
 * Mapas de presentación de estado/posición/tipo de polín, espejo del prototipo
 * (design_handoff_flujo_mesa). Centraliza colores y etiquetas para reusar en
 * el detalle de mesa, estaciones y los formularios de inspección/mantenimiento.
 */

/** Sufijo de clase CSS por estado/condición. Las clases viven en los scss (estado--ok/obs/no/na). */
export function estadoClase(estado: any): string {
  switch (String(estado)) {
    case 'OPERATIVO':
      return 'estado--ok';
    case 'OBSERVACION':
      return 'estado--obs';
    case 'NO_OPERATIVO':
      return 'estado--no';
    default:
      return 'estado--na';
  }
}

/** Etiqueta legible larga del estado/condición. */
export const ESTADO_LABEL: Record<string, string> = {
  OPERATIVO: 'Operativo',
  OBSERVACION: 'Observación',
  NO_OPERATIVO: 'No operativo',
  SIN_ESTADO: 'Sin estado',
};

/** Etiqueta corta (badges de estación): OK / OBS / FALLA. */
export const ESTADO_SHORT: Record<string, string> = {
  OPERATIVO: 'OK',
  OBSERVACION: 'OBS',
  NO_OPERATIVO: 'FALLA',
};

export function estadoLabel(estado: any): string {
  return ESTADO_LABEL[String(estado)] ?? '—';
}

/** Etiquetas de posición del polín. */
export const POSICION_LABEL: Record<string, string> = {
  UNICO: 'Único',
  CENTRAL: 'Central',
  CENTRAL_DERECHO: 'Central der.',
  CENTRAL_IZQUIERDO: 'Central izq.',
  DERECHO: 'Derecho',
  IZQUIERDO: 'Izquierdo',
};

export function posicionLabel(posicion: any): string {
  return POSICION_LABEL[String(posicion)] ?? (posicion ? String(posicion) : '—');
}

/** Etiquetas del tipo real de polín (REQ-323-005). */
export const TIPO_POLIN_LABEL: Record<string, string> = {
  IMPACTO: 'Impacto',
  RETORNO: 'Retorno',
  CARGA: 'Carga',
  PESOMETRICO: 'Pesométrico',
  AUTOLINEANTE: 'Autolineante',
};

export function tipoPolinLabel(tipo: any): string {
  return tipo ? (TIPO_POLIN_LABEL[String(tipo)] ?? String(tipo)) : 'N/A';
}

/** Estado de una estación derivado del peor estado de sus polines. */
export function estadoEstacion(estados: any[]): string {
  const norm = estados.map(e => String(e));
  if (norm.includes('NO_OPERATIVO')) {
    return 'NO_OPERATIVO';
  }
  if (norm.includes('OBSERVACION')) {
    return 'OBSERVACION';
  }
  if (norm.length && norm.every(e => e === 'OPERATIVO')) {
    return 'OPERATIVO';
  }
  return 'SIN_ESTADO';
}
