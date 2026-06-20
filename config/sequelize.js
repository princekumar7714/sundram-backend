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

  sequelize = new Sequelize('', '', '', {
    host: DB_HOST || '127.0.0.1',
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



