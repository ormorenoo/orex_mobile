import { Injectable } from '@angular/core';
import { SqliteService } from '#app/services/sqlite/sqlite.service';
import { Estado, Polin, TipoPolin } from '#app/pages/entities/polin';

@Injectable({ providedIn: 'root' })
export class PolinOfflineRepository {
  constructor(private sqlite: SqliteService) {}

  async replaceAll(polines: Polin[]): Promise<void> {
    for (const polin of polines) {
      await this.sqlite.run(
        `INSERT INTO polin (id, identificador, descripcion, tipo_polin, estado, estacion_id) VALUES (?, ?, ?, ?, ?, ?)`,
        [polin.id, polin.identificador, polin.descripcion, polin.tipoPolin, polin.estado, polin.estacion.id],
      );
    }
  }

  async findByEstacionId(idEstacion: number): Promise<Polin[]> {
    const result = await this.sqlite.query(
      `
    SELECT p.id, p.identificador, p.descripcion, p.tipo_polin, p.estado
    FROM polin p
    JOIN estacion e ON e.id = p.estacion_id
    WHERE p.estacion_id = ?
    `,
      [idEstacion],
    );

    if (!result?.values?.length) {
      return [];
    }

    return result.values.map(
      row =>
        ({
          id: row.id,
          identificador: row.identificador,
          descripcion: row.descripcion,
          tipoPolin: row.tipo_polin as TipoPolin,
          estado: row.estado as Estado,
        }) as Polin,
    );
  }

  async clear(): Promise<void> {
    await this.sqlite.run('DELETE FROM polin');
  }
}
