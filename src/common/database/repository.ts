import { psqlKnexConnection } from './connection'

/* istanbul ignore file */
export class BaseRepository<T> {
  constructor(protected readonly tableName: string) {}

  async findAll(): Promise<T[]> {
    return psqlKnexConnection(this.tableName).select('*')
  }

  async findById(id: number): Promise<T | undefined> {
    return psqlKnexConnection(this.tableName).where({ id }).first()
  }

  async find(filters: Partial<T>): Promise<T[]> {
    return psqlKnexConnection(this.tableName).where(filters)
  }

  async create(data: Partial<T>): Promise<T> {
    return psqlKnexConnection(this.tableName)
      .insert(data)
      .returning('*')
      .then((rows) => rows[0])
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    return psqlKnexConnection(this.tableName)
      .where({ id })
      .update(data)
      .returning('*')
      .then((rows) => rows[0])
  }

  async delete(id: number): Promise<void> {
    await psqlKnexConnection(this.tableName).where({ id }).del()
  }
}
