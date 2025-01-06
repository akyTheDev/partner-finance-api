import { Request, Response, NextFunction, Router } from 'express'

import { UserControllerFactory } from './controller'

const userRegisterController = UserControllerFactory.createRegisterController()

const userRouter = Router()

userRouter.post(
  '/register',
  (req: Request, res: Response, next: NextFunction) =>
    userRegisterController.register(req, res, next),
)

export { userRouter }
