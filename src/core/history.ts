import Database from 'better-sqlite3';
import path from 'path';
import os from 'os';
import fs from 'fs-extra';

export interface HistoryEntry {
  id?: number;
  timestamp: number;
  query: string;
  command: string;
  executed: boolean;
  success?: boolean;
  output?: string;
  cwd: string;
  model: string;
}

const DB_DIR = path.join(os.homedir(), '.smartshell');
const DB_FILE = path.join(DB_DIR, 'history.db');

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    fs.ensureDirSync(DB_DIR);
    db = new Database(DB_FILE);
    db.exec(`
      CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER NOT NULL,
        query TEXT NOT NULL,
        command TEXT NOT NULL,
        executed INTEGER DEFAULT 0,
        success INTEGER DEFAULT NULL,
        output TEXT DEFAULT NULL,
        cwd TEXT NOT NULL,
        model TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_timestamp ON history(timestamp);
      CREATE INDEX IF NOT EXISTS idx_query ON history(query);
    `);
  }
  return db;
}

export function addHistory(entry: Omit<HistoryEntry, 'id'>): number {
  const db = getDb();
  const stmt = db.prepare(
    'INSERT INTO history (timestamp, query, command, executed, success, output, cwd, model) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );
  const result = stmt.run(
    entry.timestamp,
    entry.query,
    entry.command,
    entry.executed ? 1 : 0,
    entry.success === undefined ? null : entry.success ? 1 : 0,
    entry.output || null,
    entry.cwd,
    entry.model
  );
  return Number(result.lastInsertRowid);
}

export function updateHistoryExecution(
  id: number,
  success: boolean,
  output?: string
): void {
  const db = getDb();
  const stmt = db.prepare(
    'UPDATE history SET executed = 1, success = ?, output = ? WHERE id = ?'
  );
  stmt.run(success ? 1 : 0, output || null, id);
}

export function searchHistory(keyword: string, limit = 20): HistoryEntry[] {
  const db = getDb();
  const stmt = db.prepare(
    'SELECT * FROM history WHERE query LIKE ? OR command LIKE ? ORDER BY timestamp DESC LIMIT ?'
  );
  const rows = stmt.all(`%${keyword}%`, `%${keyword}%`, limit) as any[];
  return rows.map((r) => ({
    id: r.id,
    timestamp: r.timestamp,
    query: r.query,
    command: r.command,
    executed: !!r.executed,
    success: r.success === null ? undefined : !!r.success,
    output: r.output || undefined,
    cwd: r.cwd,
    model: r.model,
  }));
}

export function getRecentHistory(limit = 20): HistoryEntry[] {
  const db = getDb();
  const stmt = db.prepare(
    'SELECT * FROM history ORDER BY timestamp DESC LIMIT ?'
  );
  const rows = stmt.all(limit) as any[];
  return rows.map((r) => ({
    id: r.id,
    timestamp: r.timestamp,
    query: r.query,
    command: r.command,
    executed: !!r.executed,
    success: r.success === null ? undefined : !!r.success,
    output: r.output || undefined,
    cwd: r.cwd,
    model: r.model,
  }));
}

export function clearHistory(): void {
  const db = getDb();
  db.exec('DELETE FROM history');
}

export function getHistoryStats(): { total: number; executed: number; success: number } {
  const db = getDb();
  const total = (db.prepare('SELECT COUNT(*) as c FROM history').get() as any).c;
  const executed = (db.prepare('SELECT COUNT(*) as c FROM history WHERE executed = 1').get() as any).c;
  const success = (db.prepare('SELECT COUNT(*) as c FROM history WHERE success = 1').get() as any).c;
  return { total, executed, success };
}
