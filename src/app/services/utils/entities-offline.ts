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
import { SqliteService } from './sqlite.service';

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
    private sqlite: SqliteService,
  ) {
    //envio mantenimientos
    this.postMantenimientos();
    //consulto mantenimientos
    this.mantenimientoService.query().subscribe(data => (this.mantenimientos = data.body ?? []));
    //consulto listas
    this.loadFaenasOptions();
    this.loadAreasOptions();
    this.loadCorreasTransportadorasOptions();
    this.loadMesasTrabajoOptions();
    this.loadEstacionesOptions();
    this.loadPolinesOptions();
  }

  async postMantenimientos() {
    const rows = await this.sqlite.query(`SELECT * FROM mantenimiento WHERE enviado = 0`);
    for (const row of rows.values) {
      const data = JSON.parse(row.payload);

      try {
        // Enviar al backend
        await this.mantenimientoService
          .create(data, this.fileFromBase64(data.imagenGeneral), this.fileFromBase64(data.imagenDetalle))
          .toPromise();

        // Marcar como enviado
        await this.sqlite.run(`UPDATE mantenimiento SET enviado = 1 WHERE id = ?`, [row.id]);
      } catch (e) {
        console.error('Error al sincronizar mantenimientos locales:', e);
      }
    }
    try {
      // Eliminar los enviados
      await this.sqlite.run(`DELETE mantenimiento WHERE enviado = 1`);
    } catch (e) {
      console.error('Error al eliminar los mantenimientos locales:', e);
    }
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

  fileFromBase64(base64): File | undefined {
    if (!base64) return undefined;
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], 'image.jpg', { type: mime });
  }
}
