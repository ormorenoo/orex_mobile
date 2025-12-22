import { NetworkService } from '#app/services/utils/network.service';
import { Injectable } from '@angular/core';
import { Mantenimiento, MantenimientoService } from '.';
import { firstValueFrom } from 'rxjs';
import { SaveResult } from '#app/services/utils/offline.model';
import { MantenimientoOfflineSaveService } from './mantenimiento-offline-save-service';
import { MantenimientoOfflineRepository } from '#app/repositories/mantenimiento-offline.repository';

@Injectable({ providedIn: 'root' })
export class MantenimientoDataService {
  constructor(
    private mantenimientoService: MantenimientoService,
    private saveService: MantenimientoOfflineSaveService,
    private mantenimientoRepository: MantenimientoOfflineRepository,
    private networkService: NetworkService,
  ) {}

  async save(mantenimiento: Mantenimiento, imgG?: File, imgD?: File): Promise<SaveResult> {
    const online = await this.networkService.isOnline();

    if (!online) {
      const result = await this.saveService.saveOffline(mantenimiento, imgG, imgD);

      return {
        ...result,
        mode: 'OFFLINE',
        message: 'Mantenimiento guardado localmente',
      };
    }

    try {
      const res = await firstValueFrom(this.mantenimientoService.create(mantenimiento, imgG, imgD));

      return {
        success: true,
        id: res.body?.id,
        mode: 'ONLINE',
        message: 'Mantenimiento enviado al servidor',
      };
    } catch (error) {
      const fallback = await this.saveService.saveOffline(mantenimiento, imgG, imgD);

      return {
        ...fallback,
        mode: 'OFFLINE',
        message: 'Sin conexión. Mantenimiento guardado localmente',
        error,
      };
    }
  }

  async getAll(): Promise<Mantenimiento[]> {
    const online = await this.networkService.isOnline();

    if (online) {
      const res = await firstValueFrom(this.mantenimientoService.query());
      return res.body ?? [];
    }

    return this.mantenimientoRepository.findAll();
  }

  async getById(id: number): Promise<Mantenimiento | null> {
    const online = await this.networkService.isOnline();

    if (online) {
      const res = await firstValueFrom(this.mantenimientoService.find(id));
      return res.body ?? null;
    }

    return this.mantenimientoRepository.findById(id);
  }
}
