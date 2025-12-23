import { Injectable } from '@angular/core';
import { SqliteService } from '#app/services/sqlite/sqlite.service';
import { Estacion } from '#app/pages/entities/estacion';

@Injectable({ providedIn: 'root' })
export class EstacionOfflineRepository {
  constructor(private sqlite: SqliteService) {}

  async replaceAll(estaciones: Estacion[]): Promise<void> {
    for (const estacion of estaciones) {
      await this.sqlite.run(`INSERT INTO estacion (id, identificador, mesa_trabajo_id) VALUES (?, ?, ?)`, [
        estacion.id,
        estacion.identificador,
        estacion.mesaTrabajo.id,
      ]);
    }
  }

  async findByMesaId(idMesa: number): Promise<Estacion[]> {
    const result = await this.sqlite.query(
      `
    SELECT e.id, e.identificador
    FROM estacion e
    JOIN mesa_trabajo mt ON mt.id = e.mesa_trabajo_id
    WHERE e.mesa_trabajo_id = ?
    `,
      [idMesa],
    );

    if (!result?.values?.length) {
      return [];
    }

    return result.values.map(
      row =>
        ({
          id: row.id,
          identificador: row.identificador,
        }) as Estacion,
    );
  }

  async clear(): Promise<void> {
    await this.sqlite.run('DELETE FROM estacion');
  }
}
