import * as fs from 'fs'

import { psqlKnexConnection } from '../../src/common/database/connection'

export async function runSqlCode(filePath: string): Promise<void> {
  const sql = fs.readFileSync(filePath).toString()

  try {
    await psqlKnexConnection.raw(sql)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}
