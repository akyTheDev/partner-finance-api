import Knex from 'knex'

import { config } from '../config'

export const psqlKnexConnection = Knex({
  client: 'pg',
  connection: {
    host: config.DB.HOST,
    user: config.DB.USERNAME,
    password: config.DB.PASSWORD,
    port: config.DB.PORT,
    database: process.env.DB_NAME,
  },
  pool: {
    min: 2,
    max: 10,
  },
})
