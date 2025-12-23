import { Injectable } from '@angular/core';
import { NetworkService } from '#app/services/utils/network.service';
import { EstacionOfflineRepository } from '#app/repositories/estacion-offline.repository';
import { EstacionService } from './estacion.service';
import { Estacion } from '.';

@Injectable({ providedIn: 'root' })
export class EstacionDataService {
  constructor(
    private networkService: NetworkService,
    private estacionOfflineRepository: EstacionOfflineRepository,
    private estacionService: EstacionService,
  ) {}

  async findByMesaId(idMesa: number): Promise<Estacion[]> {
    const online = await this.networkService.isOnline();

    if (online) {
      this.estacionService.findByMesaId(idMesa).subscribe(data => {
        return data.body ?? [];
      });
    }

    return this.estacionOfflineRepository.findByMesaId(idMesa);
  }
}
