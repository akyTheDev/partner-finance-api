import { UserRepositoryFactory } from '../repository'
import { UserRegisterService } from './user-register.service'

/* istanbul ignore file */
export class UserServiceFactory {
  static createRegisterService(): UserRegisterService {
    const userRepository = UserRepositoryFactory.create()
    return new UserRegisterService(userRepository)
  }
}
