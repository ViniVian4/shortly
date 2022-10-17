import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

const user = process.env.USER;
const password = process.env.PASSWORD;
const host = process.env.HOST;
const port = process.env.DATABASE_PORT;
const database = process.env.DATABASE;


const connection = new Pool({
  user,
  password,
  host,
  port,
  database
});

export default connection;