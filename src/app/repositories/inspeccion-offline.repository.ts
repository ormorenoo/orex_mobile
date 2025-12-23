import { Inspeccion } from '#app/pages/entities/inspeccion';
import { SqliteService } from '#app/services/sqlite/sqlite.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class InspeccionOfflineRepository {
  constructor(private sqlite: SqliteService) {}

  async insert(id: string, payload: any): Promise<void> {
    await this.sqlite.run(
      `INSERT INTO inspeccion (id, estado, payload, enviado)
       VALUES (?, ?, ?, 0)`,
      [id, 'PENDIENTE', JSON.stringify(payload)],
    );
  }

  async markForDelete(id: string): Promise<void> {
    await this.sqlite.run(
      `INSERT INTO inspeccion (id, estado, payload, enviado)
       VALUES (?, ?, null, 3)`,
      [id, 'ELIMINADO'],
    );
  }

  async findPending() {
    const res = await this.sqlite.query(`SELECT id, payload FROM inspeccion WHERE enviado = 0`);
    return res.values ?? [];
  }

  async markAsSent(id: string): Promise<void> {
    await this.sqlite.run(`UPDATE inspeccion SET enviado = 1 WHERE id = ?`, [id]);
  }

  async deleteSent(): Promise<void> {
    await this.sqlite.run(`DELETE FROM inspeccion WHERE enviado = 1`);
  }

  async findAll(): Promise<Inspeccion[]> {
    const result = await this.sqlite.query(`SELECT payload, id FROM inspeccion WHERE enviado = 0`);

    if (!result?.values?.length) {
      return [];
    }

    return result.values.map(row => this.mapPayloadToInspeccion(row.payload, row.id));
  }

  async findById(id: number): Promise<Inspeccion | null> {
    const result = await this.sqlite.query(`SELECT payload, id FROM inspeccion WHERE id = ?`, [id]);

    if (!result?.values?.length) {
      return null;
    }
    return this.mapPayloadToInspeccion(result.values[0].payload, result.values[1].id);
  }

  async deleteById(idLocal: string): Promise<void> {
    await this.sqlite.run(`DELETE FROM inspeccion WHERE id = ?`, [idLocal]);
  }

  private mapPayloadToInspeccion(payloadRaw: string, idLocal: string): Inspeccion {
    const payload = JSON.parse(payloadRaw);

    return new Inspeccion(
      payload.id ?? undefined,
      idLocal,
      payload.fechaCreacion ?? undefined,
      payload.condicionPolin ?? undefined,
      payload.criticidad ?? undefined,
      payload.observacion ?? undefined,
      payload.comentarios ?? undefined,
      payload.rutaFotoGeneral ?? undefined,
      payload.rutaFotoDetallePolin ?? undefined,
      payload.polin ?? undefined,
      payload.mantenimientos ?? undefined,
      payload.applicationUser ?? undefined,
    );
  }
}
