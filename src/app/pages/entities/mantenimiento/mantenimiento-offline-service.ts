import { SqliteService } from '#app/services/utils/sqlite.service';
import { Injectable } from '@angular/core';
import { MantenimientoService } from './mantenimiento.service';

@Injectable({
  providedIn: 'root',
})
export class MantenimientoOfflineService {
  constructor(
    private sqlite: SqliteService,
    private mantenimientoService: MantenimientoService,
  ) {}

  async sync() {
    const rows = await this.sqlite.query(`SELECT * FROM mantenimiento WHERE enviado = 0`);

    for (const row of rows.values) {
      const data = JSON.parse(row.payload);

      try {
        // Enviar al backend
        await this.mantenimientoService
          .create(data, this.fileFromBase64(data.imagenGeneral), this.fileFromBase64(data.imagenDetalle))
          .toPromise();

        // Marcar como enviado
        await this.sqlite.run(`UPDATE mantenimiento SET enviado = 1 WHERE id = ?`, [row.id]);
      } catch (e) {
        console.error('Error al sincronizar:', e);
      }
    }
  }

  async saveOffline(mantenimiento: any, imagenGeneral?: File, imagenDetalle?: File) {
    const idTemp = crypto.randomUUID();

    // Convertir imágenes a base64
    const imgGeneral64 = imagenGeneral ? await this.toBase64(imagenGeneral) : null;
    const imgDetalle64 = imagenDetalle ? await this.toBase64(imagenDetalle) : null;

    const payload = {
      ...mantenimiento,
      imagenGeneral: imgGeneral64,
      imagenDetalle: imgDetalle64,
    };

    // Guardar en SQLite
    await this.sqlite.run(
      `INSERT INTO mantenimiento (id, estado, payload, enviado)
       VALUES (?, ?, ?, 0)`,
      [idTemp, 'PENDIENTE', JSON.stringify(payload)],
    );

    return idTemp;
  }

  private toBase64(file: File): Promise<string | null> {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  fileFromBase64(base64): File | undefined {
    if (!base64) return undefined;
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], 'image.jpg', { type: mime });
  }
}
