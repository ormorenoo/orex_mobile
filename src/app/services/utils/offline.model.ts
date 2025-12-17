export interface OfflineSaveResult {
  success: boolean;
  id?: string;
  error?: any;
}

export interface EnityOfflineRecord {
  idLocal: string;
  estado: 'PENDIENTE' | 'ERROR' | 'ENVIADO';
  enviado: boolean;
  payload: any;
}
