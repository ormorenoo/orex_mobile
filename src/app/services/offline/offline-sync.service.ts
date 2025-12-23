import { Injectable } from '@angular/core';
import { NetworkService } from '../utils/network.service';
import { FaenaService } from '#app/pages/entities/faena';
import { FaenaOfflineRepository } from '#app/repositories/faena-offline.repository';
import { firstValueFrom } from 'rxjs';
import { InspeccionSyncService } from './inspeccion-sync.service';
import { MantenimientoSyncService } from './mantenimiento-sync.service';
import { AreaService } from '#app/pages/entities/area';
import { AreaOfflineRepository } from '#app/repositories/area-offline.repository';
import { AreaFaenaService } from '#app/pages/entities/area-faena';
import { AreaFaenaOfflineRepository } from '#app/repositories/area-faena-offline.repository';
import { CorreaTransportadoraService } from '#app/pages/entities/correa-transportadora';
import { CorreaTransportadoraOfflineRepository } from '#app/repositories/correa-transportadora-offline.repository';
import { MesaTrabajoService } from '#app/pages/entities/mesa-trabajo';
import { MesaTrabajoOfflineRepository } from '#app/repositories/mesa-trabajo-offline.repository';
import { EstacionService } from '#app/pages/entities/estacion';
import { EstacionOfflineRepository } from '#app/repositories/estacion-offline.repository';
import { PolinService } from '#app/pages/entities/polin';
import { PolinOfflineRepository } from '#app/repositories/polin-offline.repository';

@Injectable({ providedIn: 'root' })
export class OfflineSyncService {
  constructor(
    private networkService: NetworkService,
    private faenaService: FaenaService,
    private faenaOfflineRepository: FaenaOfflineRepository,
    private inspeccionSyncService: InspeccionSyncService,
    private mantenimientoSynService: MantenimientoSyncService,
    private areaService: AreaService,
    private areaRepository: AreaOfflineRepository,
    private areaFaenaService: AreaFaenaService,
    private areaFaenaRepository: AreaFaenaOfflineRepository,
    private correaService: CorreaTransportadoraService,
    private correaRepository: CorreaTransportadoraOfflineRepository,
    private mesaService: MesaTrabajoService,
    private mesaRepository: MesaTrabajoOfflineRepository,
    private estacionService: EstacionService,
    private estacionRepository: EstacionOfflineRepository,
    private polinService: PolinService,
    private polinRepository: PolinOfflineRepository,
  ) {}

  async syncAll(): Promise<void> {
    const online = await this.networkService.isOnline();
    if (!online) return;
    await this.inspeccionSyncService.sync();
    await this.mantenimientoSynService.sync();
    await this.syncCatalogos();
  }

  private async syncCatalogos() {
    await this.clearAll();
    await this.syncFaenas();
    await this.syncAreas();
    await this.syncAreasFaenas();
    await this.syncCorreas();
    await this.syncMesas();
    await this.syncEstaciones();
    await this.syncPolines();
  }

  private async syncFaenas(): Promise<void> {
    const response = await firstValueFrom(this.faenaService.query());
    const faenas = response.body ?? [];
    await this.faenaOfflineRepository.replaceAll(faenas);
  }

  private async syncAreas(): Promise<void> {
    const response = await firstValueFrom(this.areaService.query());
    const areas = response.body ?? [];
    await this.areaRepository.replaceAll(areas);
  }

  private async syncAreasFaenas(): Promise<void> {
    const response = await firstValueFrom(this.areaFaenaService.query());
    const areaFaenas = response.body ?? [];
    await this.areaFaenaRepository.replaceAll(areaFaenas);
  }

  private async syncCorreas(): Promise<void> {
    const response = await firstValueFrom(this.correaService.query());
    const correas = response.body ?? [];
    await this.correaRepository.replaceAll(correas);
  }

  private async syncMesas(): Promise<void> {
    const response = await firstValueFrom(this.mesaService.query());
    const mesas = response.body ?? [];
    await this.mesaRepository.replaceAll(mesas);
  }

  private async syncEstaciones(): Promise<void> {
    const response = await firstValueFrom(this.estacionService.query());
    const estacions = response.body ?? [];
    await this.estacionRepository.replaceAll(estacions);
  }

  private async syncPolines(): Promise<void> {
    const response = await firstValueFrom(this.polinService.query());
    const polins = response.body ?? [];
    await this.polinRepository.replaceAll(polins);
  }

  private async clearAll(): Promise<void> {
    await this.polinRepository.clear();
    await this.estacionRepository.clear();
    await this.mesaRepository.clear();
    await this.correaRepository.clear();
    await this.areaFaenaRepository.clear();
    await this.areaRepository.clear();
    await this.faenaOfflineRepository.clear();
  }
}
