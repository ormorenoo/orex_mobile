import { Injectable } from '@angular/core';
import { SqliteService } from '#app/services/sqlite/sqlite.service';
import { MesaTrabajo } from '#app/pages/entities/mesa-trabajo';

@Injectable({ providedIn: 'root' })
export class MesaTrabajoOfflineRepository {
  constructor(private sqlite: SqliteService) {}

  async replaceAll(mesas: MesaTrabajo[]): Promise<void> {
    for (const mesa of mesas) {
      await this.sqlite.run(`INSERT INTO mesa_trabajo (id, identificador, correa_transportadora_id) VALUES (?, ?, ?)`, [
        mesa.id,
        mesa.identificador,
        mesa.correaTransportadora.id,
      ]);
    }
  }

  async findByCorreaId(idCorrea: number): Promise<MesaTrabajo[]> {
    const result = await this.sqlite.query(
      `
    SELECT mt.id, mt.identificador
    FROM mesa_trabajo mt
    JOIN correa_transportadora ct ON ct.id = mt.correa_transportadora_id
    WHERE mt.correa_transportadora_id = ?
    `,
      [idCorrea],
    );

    if (!result?.values?.length) {
      return [];
    }

    return result.values.map(
      row =>
        ({
          id: row.id,
          identificador: row.identificador,
        }) as MesaTrabajo,
    );
  }

  async clear(): Promise<void> {
    await this.sqlite.run('DELETE FROM mesa_trabajo');
  }
}
