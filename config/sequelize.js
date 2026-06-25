import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const {
  DB_HOST,
  DB_PORT = '3306',
  DB_NAME,
  DB_USER,
  DB_PASS = '',
} = process.env;

let sequelize;

if (!DB_HOST || !DB_NAME || !DB_USER) {
  // On Render, missing DB env vars will happen sometimes during boot.
  // We allow the app to start; DB sync/auth endpoints may fail until env is correct.
  console.error(
    'Missing required DB env vars (MySQL disabled). Need DB_HOST, DB_NAME, DB_USER.',
    { DB_HOST, DB_NAME, DB_USER, DB_PORT: DB_PORT }
  );

  // Create a Sequelize instance only if DB_HOST exists; otherwise use a safe default.
  // This prevents hard failure when env is partially missing.
  const safeHost = DB_HOST ? DB_HOST.trim() : '127.0.0.1';
  const safeDbName = DB_NAME ? String(DB_NAME).trim() : '';
  const safeUser = DB_USER ? String(DB_USER).trim() : '';

  sequelize = new Sequelize(safeDbName, safeUser, DB_PASS || '', {
    host: safeHost,

    port: Number(DB_PORT),
    dialect: 'mysql',
    logging: false,
    define: { freezeTableName: true },
  });

} else {
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: Number(DB_PORT),
    dialect: 'mysql',
    logging: false,
  });
}

export default sequelize;



