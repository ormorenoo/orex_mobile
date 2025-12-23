import { Injectable } from '@angular/core';
import { Area } from '#app/pages/entities/area';
import { SqliteService } from '#app/services/sqlite/sqlite.service';

@Injectable({ providedIn: 'root' })
export class AreaOfflineRepository {
  constructor(private sqlite: SqliteService) {}

  async replaceAll(areas: Area[]): Promise<void> {
    for (const area of areas) {
      await this.sqlite.run(`INSERT INTO area (id, nombre) VALUES (?, ?)`, [area.id, area.nombre]);
    }
  }

  async findAll(): Promise<Area[]> {
    const result = await this.sqlite.query(`SELECT id, nombre FROM area`);

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
    await this.sqlite.run('DELETE FROM area');
  }
}
