import { SaveResult } from '#app/services/utils/offline.model';
import { SqliteService } from '#app/services/sqlite/sqlite.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MantenimientoOfflineService {
  constructor(private sqlite: SqliteService) {}

  async saveOffline(mantenimiento: any, imagenGeneral?: File, imagenDetalle?: File): Promise<SaveResult> {
    try {
      const idTemp = crypto.randomUUID();
      const imgGeneral64 = imagenGeneral ? await this.toBase64(imagenGeneral) : null;
      const imgDetalle64 = imagenDetalle ? await this.toBase64(imagenDetalle) : null;

      const payload = {
        ...mantenimiento,
        imagenGeneral: imgGeneral64,
        imagenDetalle: imgDetalle64,
      };

      await this.sqlite.run(
        `INSERT INTO mantenimiento (id, estado, payload, enviado)
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
      `INSERT INTO mantenimiento (id, estado, payload, enviado)
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
