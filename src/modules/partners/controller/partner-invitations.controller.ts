import { Request, Response, NextFunction } from 'express'

import { validate } from '../../../common/validate'
import { GetInviteDto, InviteDto, ResponseInvitationDto } from '../dto'
import { PartnerInvitationsService } from '../service'

export class PartnerInvitationsController {
  constructor(private readonly service: PartnerInvitationsService) {}

  async inviteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const inviteDto = validate<InviteDto>(InviteDto, req.body)
      const userId = res.locals.userId
      await this.service.inviteUserToPartner(userId, inviteDto)
      res.status(201).json({
        message: 'Ok',
      })
    } catch (err: any) {
      next(err)
    }
  }

  async getInvitationsOfUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = validate<GetInviteDto>(GetInviteDto, req.body)
      const userId = res.locals.userId
      const result = await this.service.getAllInvitationsOfUser(userId, status)
      res.status(200).json(result)
    } catch (err: any) {
      next(err)
    }
  }

  async respondToInvitation(req: Request, res: Response, next: NextFunction) {
    try {
      const responseInvitationDto = validate<ResponseInvitationDto>(
        ResponseInvitationDto,
        req.body,
      )
      const userId = res.locals.userId
      await this.service.respondToInvitation(userId, responseInvitationDto)
      res.status(201).json({
        message: 'Ok',
      })
    } catch (err: any) {
      next(err)
    }
  }
}
