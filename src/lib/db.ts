import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/lib/db/schema";

type Db = NeonHttpDatabase<typeof schema>;

const globalForDb = globalThis as unknown as {
  alexDb?: Db;
  alexSchemaReady?: Promise<void>;
};

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  return neon(url);
}

function getDbInstance(): Db {
  if (!globalForDb.alexDb) {
    globalForDb.alexDb = drizzle(getSql(), { schema });
  }
  return globalForDb.alexDb;
}

async function ensureSchema() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS properties (
      id text PRIMARY KEY,
      title text NOT NULL,
      description text NOT NULL DEFAULT '',
      deal_type text NOT NULL,
      property_type text NOT NULL,
      status text NOT NULL DEFAULT 'draft',
      price double precision,
      currency text NOT NULL DEFAULT 'ILS',
      rooms double precision NOT NULL,
      size_sqm double precision,
      floor integer,
      total_floors integer,
      has_elevator boolean NOT NULL DEFAULT false,
      has_parking boolean NOT NULL DEFAULT false,
      has_balcony boolean NOT NULL DEFAULT false,
      direction text,
      city text NOT NULL DEFAULT 'ירושלים',
      neighborhood text NOT NULL DEFAULT '',
      street text,
      arnona double precision,
      vaad_bayit double precision,
      area_population_notes text,
      is_opportunity boolean NOT NULL DEFAULT false,
      is_exclusive boolean NOT NULL DEFAULT false,
      images jsonb NOT NULL DEFAULT '[]'::jsonb,
      published_at timestamptz,
      archived_at timestamptz,
      deleted_at timestamptz,
      owner_name text,
      owner_phone text,
      owner_notes text,
      min_price_negotiable double precision,
      internal_notes text,
      exact_address text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id text PRIMARY KEY,
      type text NOT NULL,
      name text NOT NULL,
      phone text NOT NULL,
      message text,
      property_id text,
      property_title text,
      property_url text,
      status text NOT NULL DEFAULT 'new',
      privacy_consent_at timestamptz NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id text PRIMARY KEY,
      name text NOT NULL,
      phone text NOT NULL UNIQUE,
      email text,
      password_hash text NOT NULL,
      role text NOT NULL DEFAULT 'user',
      favorites text[] NOT NULL DEFAULT '{}',
      privacy_consent_at timestamptz NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
}

export async function connectDb(): Promise<Db> {
  if (!globalForDb.alexSchemaReady) {
    globalForDb.alexSchemaReady = ensureSchema();
  }
  await globalForDb.alexSchemaReady;
  return getDbInstance();
}

export function hasDbConfig() {
  return Boolean(process.env.DATABASE_URL);
}
