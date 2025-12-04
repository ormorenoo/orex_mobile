import { Area } from '#app/pages/entities/area/area.model';
import { AreaService } from '#app/pages/entities/area/area.service';
import { CorreaTransportadora } from '#app/pages/entities/correa-transportadora/correa-transportadora.model';
import { CorreaTransportadoraService } from '#app/pages/entities/correa-transportadora/correa-transportadora.service';
import { Estacion } from '#app/pages/entities/estacion/estacion.model';
import { EstacionService } from '#app/pages/entities/estacion/estacion.service';
import { Faena } from '#app/pages/entities/faena/faena.model';
import { FaenaService } from '#app/pages/entities/faena/faena.service';
import { InspeccionService } from '#app/pages/entities/inspeccion/inspeccion.service';
import { Mantenimiento } from '#app/pages/entities/mantenimiento/mantenimiento.model';
import { MantenimientoService } from '#app/pages/entities/mantenimiento/mantenimiento.service';
import { MesaTrabajo } from '#app/pages/entities/mesa-trabajo/mesa-trabajo.model';
import { MesaTrabajoService } from '#app/pages/entities/mesa-trabajo/mesa-trabajo.service';
import { Polin } from '#app/pages/entities/polin/polin.model';
import { PolinService } from '#app/pages/entities/polin/polin.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EntitiesOfflineService {
  faenas: Faena[] = [];
  areas: Area[] = [];
  correas: CorreaTransportadora[] = [];
  mesas: MesaTrabajo[] = [];
  estaciones: Estacion[] = [];
  polins: Polin[];
  mantenimientos: Mantenimiento[];

  constructor(
    private polinService: PolinService,
    private inspeccionService: InspeccionService,
    private mantenimientoService: MantenimientoService,
    private faenaService: FaenaService,
    private areaService: AreaService,
    private correaTransportadoraService: CorreaTransportadoraService,
    private mesaTrabajoService: MesaTrabajoService,
    private estacionService: EstacionService,
  ) {
    this.mantenimientoService.query().subscribe(data => (this.mantenimientos = data.body ?? []));
    this.loadFaenasOptions();
    this.loadAreasOptions();
    this.loadCorreasTransportadorasOptions();
    this.loadMesasTrabajoOptions();
    this.loadEstacionesOptions();
    this.loadPolinesOptions();
  }

  loadFaenasOptions(): void {
    this.faenaService.query().subscribe(data => (this.faenas = data.body ?? []));
  }

  loadAreasOptions(): void {
    this.areaService.query().subscribe(data => {
      this.areas = data.body ?? [];
    });
  }

  loadCorreasTransportadorasOptions(): void {
    this.correaTransportadoraService.query().subscribe(data => {
      this.correas = data.body ?? [];
    });
  }

  loadMesasTrabajoOptions(): void {
    this.mesaTrabajoService.query().subscribe(data => {
      this.mesas = data.body ?? [];
    });
  }

  loadEstacionesOptions(): void {
    this.estacionService.query().subscribe(data => {
      this.estaciones = data.body ?? [];
    });
  }

  loadPolinesOptions(): void {
    this.polinService.query().subscribe(data => (this.polins = data.body ?? []));
  }

  getFaenas() {
    return this.faenas;
  }
  getAreas() {
    return this.areas;
  }
  getCorreas() {
    return this.correas;
  }
  getMesas() {
    return this.mesas;
  }
  getEstaciones() {
    return this.estaciones;
  }
  getPolins() {
    return this.polins;
  }
  getMantenimientos() {
    return this.mantenimientos;
  }
}
