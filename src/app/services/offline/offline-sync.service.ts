import { Injectable } from '@angular/core';
import { NetworkService } from '../utils/network.service';
import { FaenaService } from '#app/pages/entities/faena';
import { FaenaOfflineRepository } from '#app/repositories/faena-offline.repository';
import { firstValueFrom } from 'rxjs';
import { InspeccionSyncService } from './inspeccion-sync.service';
import { MantenimientoSyncService } from './mantenimiento-sync.service';

@Injectable({ providedIn: 'root' })
export class OfflineSyncService {
  constructor(
    private networkService: NetworkService,
    private faenaService: FaenaService,
    private faenaOfflineRepository: FaenaOfflineRepository,
    private inspeccionSyncService: InspeccionSyncService,
    private mantenimientoSynService: MantenimientoSyncService,
  ) {}

  async syncAll(): Promise<void> {
    await this.inspeccionSyncService.sync();
    await this.mantenimientoSynService.sync();
    await this.syncFaenas();
  }

  private async syncFaenas(): Promise<void> {
    const online = await this.networkService.isOnline();
    if (!online) return;

    const response = await firstValueFrom(this.faenaService.query());
    const faenas = response.body ?? [];

    await this.faenaOfflineRepository.replaceAll(faenas);
  }
}
