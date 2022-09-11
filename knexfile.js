// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
import * as dotenv from 'dotenv'
dotenv.config()

const development = {
  client: 'pg',
  connection: {
    database: process.env.DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    filename: './dev.postgresData'
  },
  migrations: {
    directory: './db/migrations'
  }
};

export { development }