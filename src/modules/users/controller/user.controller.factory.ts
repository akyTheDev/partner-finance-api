import { UserServiceFactory } from '../service'
import { UserRegisterController } from './user-register.controller'

/* istanbul ignore file */
export class UserControllerFactory {
  static createRegisterController(): UserRegisterController {
    const service = UserServiceFactory.createRegisterService()
    return new UserRegisterController(service)
  }
}
