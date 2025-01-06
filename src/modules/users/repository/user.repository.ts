import { BaseRepository } from '../../../common'
import { UserModel } from '../model'

/* istanbul ignore file */
export class UserRepository extends BaseRepository<UserModel> {
  constructor() {
    super('users')
  }
}
