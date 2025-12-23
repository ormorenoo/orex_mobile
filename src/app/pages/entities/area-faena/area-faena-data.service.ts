import { Injectable } from '@angular/core';
import { AreaFaenaService } from '#app/pages/entities/area-faena';
import { AreaFaena } from '#app/pages/entities/area-faena';
import { firstValueFrom } from 'rxjs';
import { NetworkService } from '#app/services/utils/network.service';
import { AreaFaenaOfflineRepository } from '#app/repositories/area-faena-offline.repository';
import { Area } from '../area/area.model';
import { AreaService } from '../area/area.service';

@Injectable({ providedIn: 'root' })
export class AreaFaenaDataService {
  constructor(
    private networkService: NetworkService,
    private areaFaenaOfflineRepository: AreaFaenaOfflineRepository,
    private areaService: AreaService,
  ) {}

  async findAreasByFaenaId(faenaId: number): Promise<Area[]> {
    const online = await this.networkService.isOnline();

    if (online) {
      this.areaService.findByFaenaId(faenaId).subscribe(data => {
        return data.body ?? [];
      });
    }

    return this.areaFaenaOfflineRepository.findAreaByFaenaId(faenaId);
  }
}
