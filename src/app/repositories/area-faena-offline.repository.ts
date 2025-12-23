import { Injectable } from '@angular/core';
import { Area } from '#app/pages/entities/area';
import { SqliteService } from '#app/services/sqlite/sqlite.service';
import { AreaFaena } from '#app/pages/entities/area-faena';

@Injectable({ providedIn: 'root' })
export class AreaFaenaOfflineRepository {
  constructor(private sqlite: SqliteService) {}

  async replaceAll(areasFaenas: AreaFaena[]): Promise<void> {
    for (const areaFaena of areasFaenas) {
      await this.sqlite.run(`INSERT INTO area_faena (id, area_id, faena_id) VALUES (?, ?, ?)`, [
        areaFaena.id,
        areaFaena.area.id,
        areaFaena.faena.id,
      ]);
    }
  }

  async findAreaByFaenaId(idFaena: number): Promise<Area[]> {
    const result = await this.sqlite.query(
      `
    SELECT a.id, a.nombre
    FROM area_faena af
    JOIN area a ON a.id = af.area_id
    WHERE af.faena_id = ?
    `,
      [idFaena],
    );

    if (!result?.values?.length) {
      return [];
    }

    return result.values.map(
      row =>
        ({
          id: row.id,
          nombre: row.nombre,
        }) as Area,
    );
  }

  async clear(): Promise<void> {
    await this.sqlite.run('DELETE FROM area_faena');
  }
}
