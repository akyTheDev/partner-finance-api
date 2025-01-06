import { UserRepository } from './user.repository'

/* istanbul ignore file */
export class UserRepositoryFactory {
  private static repository: UserRepository

  static create(): UserRepository {
    if (!this.repository) {
      this.repository = new UserRepository()
    }
    return this.repository
  }
}
