import { Request, Response, NextFunction } from 'express'

import { validate } from '../../../common/validate'
import { PartnerCreateDto, PartnerGetOneDto } from '../dto'
import { PartnerService } from '../service'

export class PartnerController {
  constructor(private readonly service: PartnerService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const partnerCreateDto = validate(PartnerCreateDto, req.body)
      const userId = res.locals.userId
      await this.service.create(userId, partnerCreateDto)
      res.status(201).json({
        message: 'Ok',
      })
    } catch (err: any) {
      next(err)
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.userId
      const result = await this.service.getAll(userId)
      res.status(200).json(result)
    } catch (err: any) {
      next(err)
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const partnerGetOneDto = validate(PartnerGetOneDto, req.params)
      const userId = res.locals.userId
      const result = await this.service.getOne(
        userId,
        partnerGetOneDto.partnerId,
      )
      res.status(200).json(result)
    } catch (err: any) {
      next(err)
    }
  }
}
