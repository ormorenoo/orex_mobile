import { Injectable } from '@angular/core';
import { NetworkService } from '#app/services/utils/network.service';
import { CorreaTransportadoraOfflineRepository } from '#app/repositories/correa-transportadora-offline.repository';
import { CorreaTransportadoraService } from './correa-transportadora.service';
import { CorreaTransportadora } from './correa-transportadora.model';

@Injectable({ providedIn: 'root' })
export class CorreaTransportadoraDataService {
  constructor(
    private networkService: NetworkService,
    private correaTransportadoraOfflineRepository: CorreaTransportadoraOfflineRepository,
    private correaTransportadora: CorreaTransportadoraService,
  ) {}

  async findCorreaByAreaIdAndFaenaId(areaId: number, faenaId: number): Promise<CorreaTransportadora[]> {
    const online = await this.networkService.isOnline();

    if (online) {
      this.correaTransportadora.findByAreaIdAndFaenaId(areaId, faenaId).subscribe(data => {
        return data.body ?? [];
      });
    }

    return this.correaTransportadoraOfflineRepository.findCorreaByAreaIdAndFaenaId(areaId, faenaId);
  }
}
