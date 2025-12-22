import { Injectable } from '@angular/core';
import { SaveResult } from '../../../services/utils/offline.model';
import { InspeccionOfflineRepository } from '#app/repositories/inspeccion-offline.repository';

@Injectable({
  providedIn: 'root',
})
export class InspeccionOfflineSaveService {
  constructor(private repo: InspeccionOfflineRepository) {}

  async saveOffline(inspeccion: any, imagenGeneral?: File, imagenDetalle?: File): Promise<SaveResult> {
    try {
      const idTemp = crypto.randomUUID();

      const payload = {
        ...inspeccion,
        imagenGeneral: await this.toBase64(imagenGeneral),
        imagenDetalle: await this.toBase64(imagenDetalle),
      };

      await this.repo.insert(idTemp, payload);

      return { success: true, id: idTemp };
    } catch (error) {
      console.error('[Offline save error]', error);
      return { success: false, error };
    }
  }

  async deleteOffline(id: string) {
    await this.repo.markForDelete(id);
  }

  private toBase64(file?: File): Promise<string | null> {
    if (!file) return Promise.resolve(null);
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
}
