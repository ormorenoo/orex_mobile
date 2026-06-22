export enum TipoFalla {
  // --- Fallas de polín ---
  CON_CARGA_ACUMULADA = 'CON CARGA ACUMULADA',
  CON_RUIDO_Y_GOLPETEO = 'CON RUIDO Y GOLPETEO',
  CON_TEMPERATURA = 'CON TEMPERATURA',
  DE_IMPACTO_SIN_REVESTIMIENTO = 'DE IMPACTO SIN REVESTIMIENTO',
  DESBOCADO = 'DESBOCADO',
  DESGASTADO = 'DESGASTADO',
  DIAMETRO_INCORRECTO = 'DIÁMETRO INCORRECTO',
  INADECUADO = 'INADECUADO',
  INEXISTENTE = 'INEXISTENTE',
  TRABADO = 'TRABADO',
  // --- Fallas de estación ---
  OREJA_DANADA = 'OREJA DAÑADA',
  CAIDA = 'CAÍDA',
  DESNIVELADA = 'DESNIVELADA',
  FRACTURADA = 'FRACTURADA',
  // --- Fallas de polines Garland ---
  COLLERA_DESCOLGADA = 'COLLERA DESCOLGADA',
  ENGANCHE_COLLERA_FRACTURADA = 'ENGANCHE COLLERA FRACTURADA',
  COLLERA_INEXISTENTE = 'COLLERA INEXISTENTE',
  COLLERA_CON_DESGASTE_EN_PASADORES = 'COLLERA CON DESGASTE EN PASADORES',
  CADENA_INADECUADA = 'CADENA INADECUADA',
}

/** Códigos de falla a listar para un polín (estación no Garland). */
export const TIPO_FALLA_POLIN: string[] = [
  'DESBOCADO',
  'INEXISTENTE',
  'CON_CARGA_ACUMULADA',
  'DESGASTADO',
  'TRABADO',
  'INADECUADO',
  'DIAMETRO_INCORRECTO',
  'CON_TEMPERATURA',
  'DE_IMPACTO_SIN_REVESTIMIENTO',
  'CON_RUIDO_Y_GOLPETEO',
];

/** Códigos de falla a listar para una estación (no Garland). */
export const TIPO_FALLA_ESTACION: string[] = ['OREJA_DANADA', 'CAIDA', 'DESNIVELADA', 'INEXISTENTE', 'FRACTURADA'];

/** Códigos de falla a listar para polines/estación Garland. */
export const TIPO_FALLA_GARLAND: string[] = [
  'COLLERA_DESCOLGADA',
  'ENGANCHE_COLLERA_FRACTURADA',
  'COLLERA_INEXISTENTE',
  'COLLERA_CON_DESGASTE_EN_PASADORES',
  'CADENA_INADECUADA',
];

/**
 * Devuelve los códigos de falla a mostrar según el contexto.
 * - Estación Garland (a nivel estación o cualquier polín suyo): fallas Garland.
 * - Resto a nivel estación: fallas de estación.
 * - Resto a nivel polín: fallas de polín.
 */
export function fallasPorContexto(esEstacion: boolean, tipoEstacion: any): string[] {
  if (String(tipoEstacion) === 'GARLAND') {
    return TIPO_FALLA_GARLAND;
  }
  return esEstacion ? TIPO_FALLA_ESTACION : TIPO_FALLA_POLIN;
}
