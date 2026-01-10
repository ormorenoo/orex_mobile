import { Injectable } from '@angular/core';
import { NetworkService } from '#app/services/utils/network.service';
import { MesaTrabajoOfflineRepository } from '#app/repositories/mesa-trabajo-offline.repository';
import { MesaTrabajoService } from './mesa-trabajo.service';
import { MesaTrabajo } from './mesa-trabajo.model';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MesaTrabajoDataService {
  constructor(
    private networkService: NetworkService,
    private mesaTrabajoOfflineRepository: MesaTrabajoOfflineRepository,
    private mesaTrabajoService: MesaTrabajoService,
  ) {}

  async findByCorreaId(idCorrea: number): Promise<MesaTrabajo[]> {
    const online = await this.networkService.isOnline();

    if (online) {
      const response = await firstValueFrom(this.mesaTrabajoService.findByCorreaId(idCorrea));
      return response.body ?? [];
    }

    return this.mesaTrabajoOfflineRepository.findByCorreaId(idCorrea);
  }
}
