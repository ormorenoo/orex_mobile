import { InspeccionService } from '#app/pages/entities/inspeccion';
import { InspeccionOfflineRepository } from '#app/repositories/inspeccion-offline.repository';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InspeccionSyncService {
  constructor(
    private inspeccionService: InspeccionService,
    private inspeccionRepository: InspeccionOfflineRepository,
  ) {}

  async sync(): Promise<void> {
    const pendientes = await this.inspeccionRepository.findPending();

    if (!pendientes.length) {
      return;
    }

    for (const row of pendientes) {
      await this.syncOne(row.id, row.payload);
    }

    await this.inspeccionRepository.deleteSent();
  }

  private async syncOne(idLocal: string, payloadRaw: string): Promise<void> {
    const payload = JSON.parse(payloadRaw);

    const inspeccionRequest = {
      id: undefined,
      fechaCreacion: payload.fechaCreacion,
      condicionPolin: payload.condicionPolin,
      criticidad: payload.criticidad,
      observacion: payload.observacion,
      comentarios: payload.comentarios,
      rutaFotoGeneral: payload.rutaFotoGeneral,
      rutaFotoDetallePolin: payload.rutaFotoDetallePolin,
      polin: payload.polin,
      applicationUser: payload.applicationUser,
    };

    try {
      await firstValueFrom(
        this.inspeccionService.create(
          inspeccionRequest,
          this.fileFromBase64(payload.imagenGeneral),
          this.fileFromBase64(payload.imagenDetalle),
        ),
      );

      await this.inspeccionRepository.markAsSent(idLocal);
    } catch (error) {
      if (this.isInvalidPolinError(error)) {
        console.warn(`Inspección ${idLocal} eliminada: polín inexistente en servidor`);
        await this.inspeccionRepository.deleteById(idLocal);
      }
      console.error('[SYNC][INSPECCION] Error sincronizando', idLocal, error);
    }
  }

  private isInvalidPolinError(err: any): boolean {
    return err?.status === 500;
  }

  private fileFromBase64(base64?: string): File | undefined {
    if (!base64) return undefined;

    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);

    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], 'image.jpg', { type: mime });
  }
}
