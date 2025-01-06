import { Request, Response, NextFunction, Router } from 'express'

import { UserControllerFactory } from './controller'

const userRegisterController = UserControllerFactory.createRegisterController()
const userLoginController = UserControllerFactory.createLoginController()

const userRouter = Router()

userRouter.post(
  '/register',
  (req: Request, res: Response, next: NextFunction) =>
    userRegisterController.register(req, res, next),
)

userRouter.post('/login', (req: Request, res: Response, next: NextFunction) =>
  userLoginController.login(req, res, next),
)

export { userRouter }
