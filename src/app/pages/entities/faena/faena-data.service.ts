import { Injectable } from '@angular/core';
import { FaenaService } from '#app/pages/entities/faena/faena.service';
import { Faena } from '#app/pages/entities/faena/faena.model';
import { firstValueFrom } from 'rxjs';
import { NetworkService } from '#app/services/utils/network.service';
import { FaenaOfflineRepository } from '#app/repositories/faena-offline.repository';

@Injectable({ providedIn: 'root' })
export class FaenaDataService {
  constructor(
    private networkService: NetworkService,
    private faenaService: FaenaService,
    private faenaOfflineRepository: FaenaOfflineRepository,
  ) {}

  async getAll(): Promise<Faena[]> {
    const online = await this.networkService.isOnline();

    if (online) {
      const res = await firstValueFrom(this.faenaService.query());
      return res.body ?? [];
    }

    return this.faenaOfflineRepository.findAll();
  }

  async getById(id: number): Promise<Faena | null> {
    const online = await this.networkService.isOnline();

    if (online) {
      const res = await firstValueFrom(this.faenaService.find(id));
      return res.body ?? null;
    }

    return this.faenaOfflineRepository.findById(id);
  }
}
