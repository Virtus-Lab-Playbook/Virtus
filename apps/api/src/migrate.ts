import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Client } from 'pg';

async function migrate(): Promise<void> {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    const sql = await readFile(resolve(__dirname, '../sql/001_operations.sql'), 'utf8');
    await client.query(sql);
    process.stdout.write('Operations database migration applied.\n');
  } finally {
    await client.end();
  }
}

void migrate();
