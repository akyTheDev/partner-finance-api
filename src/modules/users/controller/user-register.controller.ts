import { NextFunction, Request, Response } from 'express'

import { validate } from '../../../common/validate'
import { UserRegisterDto } from '../dto'
import { UserRegisterService } from '../service'

export class UserRegisterController {
  constructor(private readonly service: UserRegisterService) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const userRegisterDto = validate<UserRegisterDto>(
        UserRegisterDto,
        req.body,
      )
      await this.service.register(userRegisterDto)
      res.status(201).json({
        message: 'Ok',
      })
    } catch (err: any) {
      next(err)
    }
  }
}
