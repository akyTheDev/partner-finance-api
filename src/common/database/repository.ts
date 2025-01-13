import { Knex } from 'knex'
import { psqlKnexConnection } from './connection'

/* istanbul ignore file */
export abstract class BaseRepository<T> {
  protected readonly connection: Knex
  constructor(protected readonly tableName: string) {
    this.connection = psqlKnexConnection
  }

  async findAll(): Promise<T[]> {
    return this.connection(this.tableName).select('*')
  }

  async findById(id: number): Promise<T | undefined> {
    return this.connection(this.tableName).where({ id }).first()
  }

  async find(filters: Partial<T>): Promise<T[]> {
    return this.connection(this.tableName).where(filters)
  }

  async create(data: Partial<T>): Promise<T> {
    return this.connection(this.tableName)
      .insert(data)
      .returning('*')
      .then((rows) => rows[0])
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    return this.connection(this.tableName)
      .where({ id })
      .update(data)
      .returning('*')
      .then((rows) => rows[0])
  }

  async delete(id: number): Promise<void> {
    await this.connection(this.tableName).where({ id }).del()
  }
}
