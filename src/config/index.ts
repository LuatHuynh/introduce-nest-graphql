require('dotenv').config();

class Config {
  POSTGRES_HOST: string = process.env.POSTGRES_HOST;
  POSTGRES_PORT: number = parseInt(process.env.POSTGRES_PORT);
  POSTGRES_USER: string = process.env.POSTGRES_USER;
  POSTGRES_PASSWORD: string = process.env.POSTGRES_PASSWORD;
  POSTGRES_DB: string = process.env.POSTGRES_DB;
  UUID_VERSION: '3' | '4' | '5' = '4';
}

export const config = new Config();
