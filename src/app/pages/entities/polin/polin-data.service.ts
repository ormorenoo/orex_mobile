import { Injectable } from '@angular/core';
import { NetworkService } from '#app/services/utils/network.service';
import { PolinOfflineRepository } from '#app/repositories/polin-offline.repository';
import { PolinService } from './polin.service';
import { Polin } from '.';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PolinDataService {
  constructor(
    private networkService: NetworkService,
    private polinOfflineRepository: PolinOfflineRepository,
    private polinService: PolinService,
  ) {}

  async findByEstacionId(idEstacion: number): Promise<Polin[]> {
    const online = await this.networkService.isOnline();

    if (online) {
      const response = await firstValueFrom(this.polinService.findByEstacionId(idEstacion));
      return response.body ?? [];
    }

    return this.polinOfflineRepository.findByEstacionId(idEstacion);
  }
}
