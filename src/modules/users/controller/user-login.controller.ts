import { NextFunction, Request, Response } from 'express'

import { validate } from '../../../common/validate'
import { UserLoginDto } from '../dto'
import { UserLoginService } from '../service'

export class UserLoginController {
  constructor(private readonly service: UserLoginService) {}

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const userLoginDto = validate<UserLoginDto>(UserLoginDto, req.body)
      const result = await this.service.login(userLoginDto)
      res.status(201).json(result)
    } catch (err: any) {
      next(err)
    }
  }
}
