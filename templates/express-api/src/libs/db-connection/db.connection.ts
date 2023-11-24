import { Pool, PoolConfig } from 'pg';

const poolConfig: PoolConfig = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.POSTGRES_LOCAL_DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

const poolConfigTest: PoolConfig = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.POSTGRES_LOCAL_DB_PORT_TEST),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD_TEST,
  database: process.env.DB_DATABASE_TEST,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

export const dbPool = process.env.NODE_ENV === 'test' ? poolConfigTest : poolConfig;
