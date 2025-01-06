import { runSqlCode } from './utils'

export async function teardown() {
  console.log('Test data is being removed...')
  await runSqlCode('tests/setup/test_data_delete.sql')
  console.log('Test data deleted.')
  process.exit(0)
}

teardown()
