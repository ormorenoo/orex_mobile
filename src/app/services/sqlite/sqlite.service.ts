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
        nombre TEXT NOT NULL
      );
    `;

    await this.db.execute(createMantenimientoTable);
    await this.db.execute(createInspeccionTable);
    await this.db.execute(createQueueTable);
    await this.db.execute(createFaenaTable);

    console.log('Tablas creadas/existentes OK');
  }

  async run(query: string, params: any[] = []) {
    return this.db.run(query, params);
  }

  async query(query: string, params: any[] = []) {
    return this.db.query(query, params);
  }
}
