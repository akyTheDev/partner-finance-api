import { BaseRepository } from '../../../common'
import { UserModel } from '../model'

export class UserRepository extends BaseRepository<UserModel> {
  constructor() {
    super('users')
  }

  /**
   * Find the user by email.
   *
   * @param email The email to find.
   * @returns The user or undefined.
   */
  async findByEmail(email: string): Promise<UserModel | undefined> {
    const existingUser = await this.find({
      email,
    })
    return existingUser.length > 0 ? existingUser[0] : undefined
  }
}
