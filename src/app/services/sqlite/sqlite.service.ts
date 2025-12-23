import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  private sqliteConnection!: SQLiteConnection;
  private db!: SQLiteDBConnection;

  constructor() {
    this.init();
  }

  async init() {
    this.sqliteConnection = new SQLiteConnection(CapacitorSQLite);

    this.db = await this.sqliteConnection.createConnection('localdb', false, 'no-encryption', 1, false);

    await this.db.open();

    await this.db.execute(`PRAGMA foreign_keys = ON;`);

    await this.createTables();
  }

  private async createTables() {
    const createMantenimientoTable = `
      CREATE TABLE IF NOT EXISTS mantenimiento (
        id TEXT PRIMARY KEY,
        estado TEXT,
        payload TEXT,
        enviado INTEGER DEFAULT 0
      );
    `;

    const createInspeccionTable = `
      CREATE TABLE IF NOT EXISTS inspeccion (
        id TEXT PRIMARY KEY,
        estado TEXT,
        payload TEXT,
        enviado INTEGER DEFAULT 0
      );
    `;

    const createQueueTable = `
      CREATE TABLE IF NOT EXISTS sync_queue (
        id TEXT PRIMARY KEY,
        operacion TEXT,
        payload TEXT
      );
    `;

    const createFaenaTable = `
      CREATE TABLE IF NOT EXISTS faena (
        id INTEGER PRIMARY KEY,
        nombre TEXT
      );
    `;

    const createAreaTable = `
      CREATE TABLE IF NOT EXISTS area (
        id INTEGER PRIMARY KEY,
        nombre TEXT
      );
    `;

    const createAreaFaenaTable = `
      CREATE TABLE IF NOT EXISTS area_faena (
        id INTEGER PRIMARY KEY,
        faena_id INTEGER,
        area_id INTEGER,
        FOREIGN KEY (faena_id) REFERENCES faena(id),
        FOREIGN KEY (area_id) REFERENCES area(id)
      );
    `;

    const createCorreaTransportadoraTable = `
      CREATE TABLE IF NOT EXISTS correa_transportadora (
        id INTEGER PRIMARY KEY,
        tag_id TEXT,
        area_faena_id INTEGER,
        FOREIGN KEY (area_faena_id) REFERENCES area_faena(id)
      );
    `;

    const createMesaTrabajoTable = `
      CREATE TABLE IF NOT EXISTS mesa_trabajo (
        id INTEGER PRIMARY KEY,
        identificador TEXT,
        correa_transportadora_id INTEGER,
        FOREIGN KEY (correa_transportadora_id) REFERENCES correa_transportadora(id)
      );
    `;

    const createEstacionTable = `
      CREATE TABLE IF NOT EXISTS estacion (
        id INTEGER PRIMARY KEY,
        identificador TEXT,
        mesa_trabajo_id INTEGER,
        FOREIGN KEY (mesa_trabajo_id) REFERENCES mesa_trabajo(id)
      );
    `;

    const createPolinTable = `
      CREATE TABLE IF NOT EXISTS polin (
        id INTEGER PRIMARY KEY,
        identificador TEXT,
        descripcion TEXT,
        tipo_polin TEXT,
        estado TEXT,
        estacion_id INTEGER,
        FOREIGN KEY (estacion_id) REFERENCES estacion(id)
      );
    `;

    const createIndexes = `
    CREATE INDEX IF NOT EXISTS idx_area_faena_area_id_faena_id
    ON area_faena (area_id, faena_id);

    CREATE INDEX IF NOT EXISTS idx_correa_transportadora_area_faena_id
    ON correa_transportadora (area_faena_id);

    CREATE INDEX IF NOT EXISTS idx_mesa_trabajo_correa_transportadora_id
    ON mesa_trabajo (correa_transportadora_id);

    CREATE INDEX IF NOT EXISTS idx_estacion_mesa_trabajo_id
    ON estacion (mesa_trabajo_id);

    CREATE INDEX IF NOT EXISTS idx_polin_estacion_id
    ON polin (estacion_id);
  `;

    await this.db.execute(createMantenimientoTable);
    await this.db.execute(createInspeccionTable);
    await this.db.execute(createQueueTable);
    await this.db.execute(createFaenaTable);
    await this.db.execute(createAreaTable);
    await this.db.execute(createAreaFaenaTable);
    await this.db.execute(createCorreaTransportadoraTable);
    await this.db.execute(createMesaTrabajoTable);
    await this.db.execute(createEstacionTable);
    await this.db.execute(createPolinTable);

    await this.db.execute(createIndexes);

    console.log('Tablas creadas/existentes OK');
  }

  async run(query: string, params: any[] = []) {
    return this.db.run(query, params);
  }

  async query(query: string, params: any[] = []) {
    return this.db.query(query, params);
  }
}
