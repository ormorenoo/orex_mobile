import { Mantenimiento } from '#app/pages/entities/mantenimiento';
import { SqliteService } from '#app/services/sqlite/sqlite.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MantenimientoOfflineRepository {
  constructor(private sqlite: SqliteService) {}

  async insert(id: string, payload: any): Promise<void> {
    await this.sqlite.run(
      `INSERT INTO mantenimiento (id, estado, payload, enviado)
       VALUES (?, ?, ?, 0)`,
      [id, 'PENDIENTE', JSON.stringify(payload)],
    );
  }

  async markForDelete(id: string): Promise<void> {
    await this.sqlite.run(
      `INSERT INTO mantenimiento (id, estado, payload, enviado)
       VALUES (?, ?, null, 3)`,
      [id, 'ELIMINADO'],
    );
  }

  async findPending() {
    const res = await this.sqlite.query(`SELECT id, payload FROM mantenimiento WHERE enviado = 0`);
    return res.values ?? [];
  }

  async markAsSent(id: string): Promise<void> {
    await this.sqlite.run(`UPDATE mantenimiento SET enviado = 1 WHERE id = ?`, [id]);
  }

  async deleteSent(): Promise<void> {
    await this.sqlite.run(`DELETE FROM mantenimiento WHERE enviado = 1`);
  }

  async findAll(): Promise<Mantenimiento[]> {
    const result = await this.sqlite.query(`SELECT payload, id FROM mantenimiento WHERE enviado = 0`);

    if (!result?.values?.length) {
      return [];
    }

    return result.values.map(row => this.mapPayloadToMantenimiento(row.payload, row.id));
  }

  async findById(id: number): Promise<Mantenimiento | null> {
    const result = await this.sqlite.query(`SELECT payload, id FROM mantenimiento WHERE id = ?`, [id]);

    if (!result?.values?.length) {
      return null;
    }
    return this.mapPayloadToMantenimiento(result.values[0].payload, result.values[1].id);
  }

  async deleteById(idLocal: string): Promise<void> {
    await this.sqlite.run(`DELETE FROM mantenimiento WHERE id = ?`, [idLocal]);
  }

  private mapPayloadToMantenimiento(payloadRaw: string, idLocal: string): Mantenimiento {
    const payload = JSON.parse(payloadRaw);

    return new Mantenimiento(
      payload.id ?? undefined,
      idLocal,
      payload.fechaCreacion ?? undefined,
      payload.condicionPolin ?? undefined,
      payload.rutaFotoGeneral ?? undefined,
      payload.rutaFotoDetallePolin ?? undefined,
      payload.polin ?? undefined,
      payload.mantenimientos ?? undefined,
      payload.applicationUser ?? undefined,
    );
  }
}
