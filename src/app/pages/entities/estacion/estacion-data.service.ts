import { Injectable } from '@angular/core';
import { NetworkService } from '#app/services/utils/network.service';
import { EstacionOfflineRepository } from '#app/repositories/estacion-offline.repository';
import { EstacionService } from './estacion.service';
import { Estacion } from '.';
import { firstValueFrom } from 'rxjs';

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
      const response = await firstValueFrom(this.estacionService.findByMesaId(idMesa));
      return response.body ?? [];
    }

    return this.estacionOfflineRepository.findByMesaId(idMesa);
  }
}
