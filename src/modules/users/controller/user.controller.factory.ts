import { UserServiceFactory } from '../service'
import { UserLoginController } from './user-login.controller'
import { UserRegisterController } from './user-register.controller'

/* istanbul ignore file */
export class UserControllerFactory {
  static createRegisterController(): UserRegisterController {
    const service = UserServiceFactory.createRegisterService()
    return new UserRegisterController(service)
  }

  static createLoginController(): UserLoginController {
    const service = UserServiceFactory.createLoginService()
    return new UserLoginController(service)
  }
}
