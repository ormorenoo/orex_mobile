import { SqliteService } from '#app/services/utils/sqlite.service';
import { Injectable } from '@angular/core';
import { OfflineSaveResult } from '../../../services/utils/offline.model';

@Injectable({
  providedIn: 'root',
})
export class InspeccionOfflineService {
  constructor(private sqlite: SqliteService) {}

  async saveOffline(inspeccion: any, imagenGeneral?: File, imagenDetalle?: File): Promise<OfflineSaveResult> {
    try {
      const idTemp = crypto.randomUUID();

      const imgGeneral64 = imagenGeneral ? await this.toBase64(imagenGeneral) : null;
      const imgDetalle64 = imagenDetalle ? await this.toBase64(imagenDetalle) : null;

      const payload = {
        ...inspeccion,
        imagenGeneral: imgGeneral64,
        imagenDetalle: imgDetalle64,
      };

      await this.sqlite.run(
        `INSERT INTO inspeccion (id, estado, payload, enviado)
       VALUES (?, ?, ?, 0)`,
        [idTemp, 'PENDIENTE', JSON.stringify(payload)],
      );

      return {
        success: true,
        id: idTemp,
      };
    } catch (error) {
      console.error('[Offline save error]', error);
      return {
        success: false,
        error,
      };
    }
  }

  async deleteOffline(id: any) {
    await this.sqlite.run(
      `INSERT INTO inspeccion (id, estado, payload, enviado)
       VALUES (?, ?, null, 3)`,
      [id, 'ELIMINADO'],
    );
  }

  private toBase64(file: File): Promise<string | null> {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
}
