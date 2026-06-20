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

if (!DB_HOST || !DB_NAME || !DB_USER) {
  // Don't silently try localhost in production.
  // This prevents confusing ECONNREFUSED errors on Render.
  throw new Error(
    `Missing required DB env vars. Need DB_HOST, DB_NAME, DB_USER. Got: DB_HOST=${DB_HOST}, DB_NAME=${DB_NAME}, DB_USER=${DB_USER}`
  );
}


const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: 'mysql',
  logging: false,
});

export default sequelize;

