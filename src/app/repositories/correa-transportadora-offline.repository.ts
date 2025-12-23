import { Injectable } from '@angular/core';
import { CorreaTransportadora } from '#app/pages/entities/correa-transportadora';
import { SqliteService } from '#app/services/sqlite/sqlite.service';

@Injectable({ providedIn: 'root' })
export class CorreaTransportadoraOfflineRepository {
  constructor(private sqlite: SqliteService) {}

  async replaceAll(correas: CorreaTransportadora[]): Promise<void> {
    for (const correa of correas) {
      await this.sqlite.run(`INSERT INTO correa_transportadora (id, tag_id, area_faena_id) VALUES (?, ?, ?)`, [
        correa.id,
        correa.tagId,
        correa.areaFaena.id,
      ]);
    }
  }

  async findCorreaByAreaIdAndFaenaId(idArea: number, idFaena: number): Promise<CorreaTransportadora[]> {
    const result = await this.sqlite.query(
      `
    SELECT ct.id, ct.tag_id
    FROM correa_transportadora ct
    JOIN area_faena af ON af.id = ct.area_faena_id
    WHERE af.area_id = ? AND af.faena_id = ?
    `,
      [idArea, idFaena],
    );

    if (!result?.values?.length) {
      return [];
    }

    return result.values.map(
      row =>
        ({
          id: row.id,
          tagId: row.tag_id,
        }) as CorreaTransportadora,
    );
  }

  async clear(): Promise<void> {
    await this.sqlite.run('DELETE FROM correa_transportadora');
  }
}
