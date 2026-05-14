import dotenv from 'dotenv';
import pg from 'pg';
import dns from 'dns';
import net from 'net';

dotenv.config();

// Force IPv4 DNS resolution globally to fix Render + Supabase IPv6 issue
dns.setDefaultResultOrder('ipv4first');

const { Pool } = pg;

// Override the pg module's connection to force IPv4
const origConnect = net.Socket.prototype.connect;
net.Socket.prototype.connect = function (options, ...args) {
  if (typeof options === 'object' && options.host && !net.isIP(options.host)) {
    options.family = 4;
  }
  return origConnect.call(this, options, ...args);
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.SUPABASE_DB_SSL === 'true' || process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error', error);
});

export const query = (text, params) => pool.query(text, params);
export const getClient = () => pool.connect();
export default pool;