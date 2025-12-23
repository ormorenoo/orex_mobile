import { Injectable } from '@angular/core';
import { NetworkService } from '#app/services/utils/network.service';
import { PolinOfflineRepository } from '#app/repositories/polin-offline.repository';
import { PolinService } from './polin.service';
import { Polin } from '.';

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
      this.polinService.findByEstacionId(idEstacion).subscribe(data => {
        return data.body ?? [];
      });
    }

    return this.polinOfflineRepository.findByEstacionId(idEstacion);
  }
}
