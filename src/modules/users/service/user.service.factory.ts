import { UserRepositoryFactory } from '../repository'
import { UserLoginService } from './user-login.service'
import { UserRegisterService } from './user-register.service'

/* istanbul ignore file */
export class UserServiceFactory {
  static createRegisterService(): UserRegisterService {
    const userRepository = UserRepositoryFactory.create()
    return new UserRegisterService(userRepository)
  }

  static createLoginService(): UserLoginService {
    const userRepository = UserRepositoryFactory.create()
    return new UserLoginService(userRepository)
  }
}
