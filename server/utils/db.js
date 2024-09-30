import mysql from 'mysql2/promise';

const config = useRuntimeConfig();

export const pool = mysql.createPool({
  host: config.dbUrl,
  port: config.dbPort,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbDatabase,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
export default pool;