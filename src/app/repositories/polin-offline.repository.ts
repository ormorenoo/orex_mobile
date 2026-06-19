import { Injectable } from '@angular/core';
import { SqliteService } from '#app/services/sqlite/sqlite.service';
import { Estado, Polin, PosicionPolin, TipoPolin } from '#app/pages/entities/polin';

@Injectable({ providedIn: 'root' })
export class PolinOfflineRepository {
  constructor(private sqlite: SqliteService) {}

  async replaceAll(polines: Polin[]): Promise<void> {
    for (const polin of polines) {
      await this.sqlite.run(
        `INSERT INTO polin (id, identificador, descripcion, posicion_polin, tipo_polin, estado, codigo_sap, estacion_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          polin.id,
          polin.identificador,
          polin.descripcion,
          polin.posicionPolin,
          polin.tipoPolin ?? null,
          polin.estado,
          polin.codigoSap ?? null,
          polin.estacion.id,
        ],
      );
    }
  }

  async findByEstacionId(idEstacion: number): Promise<Polin[]> {
    const result = await this.sqlite.query(
      `
    SELECT p.id, p.identificador, p.descripcion, p.posicion_polin, p.tipo_polin, p.estado, p.codigo_sap
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
          posicionPolin: row.posicion_polin as PosicionPolin,
          tipoPolin: row.tipo_polin as TipoPolin,
          estado: row.estado as Estado,
          codigoSap: row.codigo_sap ?? undefined,
        }) as Polin,
    );
  }

  async clear(): Promise<void> {
    await this.sqlite.run('DELETE FROM polin');
  }
}
