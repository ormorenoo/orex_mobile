import { MantenimientoService } from '#app/pages/entities/mantenimiento';
import { MantenimientoOfflineRepository } from '#app/repositories/mantenimiento-offline.repository';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MantenimientoSyncService {
  constructor(
    private mantenimientoService: MantenimientoService,
    private mantenimientoRepository: MantenimientoOfflineRepository,
  ) {}

  async sync(): Promise<void> {
    const pendientes = await this.mantenimientoRepository.findPending();

    if (!pendientes.length) {
      return;
    }

    for (const row of pendientes) {
      await this.syncOne(row.id, row.payload);
    }

    await this.mantenimientoRepository.deleteSent();
  }

  private async syncOne(idLocal: string, payloadRaw: string): Promise<void> {
    const payload = JSON.parse(payloadRaw);

    const manteminientoRequest = {
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
        this.mantenimientoService.create(
          manteminientoRequest,
          this.fileFromBase64(payload.imagenGeneral),
          this.fileFromBase64(payload.imagenDetalle),
        ),
      );

      await this.mantenimientoRepository.markAsSent(idLocal);
    } catch (error) {
      if (this.isInvalidPolinError(error)) {
        console.warn(`Mantenimiento ${idLocal} eliminado: polín inexistente en servidor`);
        await this.mantenimientoRepository.deleteById(idLocal);
      }
      console.error('[SYNC][MANTENIMIENTO] Error sincronizando', idLocal, error);
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
