import { Injectable } from '@angular/core';
import { Faena } from '#app/pages/entities/faena/faena.model';
import { SqliteService } from '#app/services/sqlite/sqlite.service';

@Injectable({ providedIn: 'root' })
export class FaenaOfflineRepository {
  constructor(private sqlite: SqliteService) {}

  async replaceAll(faenas: Faena[]): Promise<void> {
    await this.sqlite.run('DELETE FROM faena');

    for (const faena of faenas) {
      await this.sqlite.run(`INSERT INTO faena (id, nombre) VALUES (?, ?)`, [faena.id, faena.nombre]);
    }
  }

  async findAll(): Promise<Faena[]> {
    const result = await this.sqlite.query(`SELECT id, nombre FROM faena`);

    if (!result?.values?.length) {
      return [];
    }

    return result.values.map(
      row =>
        ({
          id: row.id,
          nombre: row.nombre,
        }) as Faena,
    );
  }

  async findById(id: number): Promise<Faena | null> {
    const result = await this.sqlite.query(`SELECT id, nombre FROM faena WHERE id = ?`, [id]);

    if (!result?.values?.length) {
      return null;
    }

    return {
      id: result.values[0].id,
      nombre: result.values[0].nombre,
    } as Faena;
  }

  async clear(): Promise<void> {
    await this.sqlite.run('DELETE FROM faena');
  }
}
