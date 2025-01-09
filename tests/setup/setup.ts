import { runSqlCode } from './utils'

export async function setup() {
  console.log('Test data is being created...')
  await runSqlCode('tests/setup/test_data_create.sql')
  console.log('Test data created.')
  process.exit(0)
}

setup()
