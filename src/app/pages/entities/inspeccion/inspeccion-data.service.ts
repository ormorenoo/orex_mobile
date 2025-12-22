import { NetworkService } from '#app/services/utils/network.service';
import { Injectable } from '@angular/core';
import { Inspeccion, InspeccionService } from '.';
import { InspeccionOfflineSaveService } from './inspeccion-offline-save-service';
import { firstValueFrom } from 'rxjs';
import { InspeccionOfflineRepository } from '#app/repositories/inspeccion-offline.repository';
import { SaveResult } from '#app/services/utils/offline.model';

@Injectable({ providedIn: 'root' })
export class InspeccionDataService {
  constructor(
    private inspeccionService: InspeccionService,
    private saveService: InspeccionOfflineSaveService,
    private inspeccionRepository: InspeccionOfflineRepository,
    private networkService: NetworkService,
  ) {}

  async save(inspeccion: Inspeccion, imgG?: File, imgD?: File): Promise<SaveResult> {
    const online = await this.networkService.isOnline();

    if (!online) {
      const result = await this.saveService.saveOffline(inspeccion, imgG, imgD);

      return {
        ...result,
        mode: 'OFFLINE',
        message: 'Inspección guardada localmente',
      };
    }

    try {
      const res = await firstValueFrom(this.inspeccionService.create(inspeccion, imgG, imgD));

      return {
        success: true,
        id: res.body?.id,
        mode: 'ONLINE',
        message: 'Inspección enviada al servidor',
      };
    } catch (error) {
      const fallback = await this.saveService.saveOffline(inspeccion, imgG, imgD);

      return {
        ...fallback,
        mode: 'OFFLINE',
        message: 'Sin conexión. Inspección guardada localmente',
        error,
      };
    }
  }

  async getAll(): Promise<Inspeccion[]> {
    const online = await this.networkService.isOnline();

    if (online) {
      const res = await firstValueFrom(this.inspeccionService.query());
      return res.body ?? [];
    }

    return this.inspeccionRepository.findAll();
  }

  async getById(id: number): Promise<Inspeccion | null> {
    const online = await this.networkService.isOnline();

    if (online) {
      const res = await firstValueFrom(this.inspeccionService.find(id));
      return res.body ?? null;
    }

    return this.inspeccionRepository.findById(id);
  }
}
