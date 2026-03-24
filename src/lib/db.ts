//This file creates a sort of "gateway" for our app, it allows every file to make a connection
// to Postgres by simply doing import {pool} from "@/src/lib/db" and then running queries on it
import { Pool } from "pg";

const globalForDb = globalThis as unknown as {
  pool?: Pool;
};

export const pool =
  globalForDb.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV != "production") {
  globalForDb.pool = pool;
}