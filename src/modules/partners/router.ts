import { Request, Response, NextFunction, Router } from 'express'

import {
  PartnerControllerFactory,
  PartnerInvitationsControllerFactory,
} from './controller'

const partnerController = PartnerControllerFactory.create()
const partnerInvitationsController =
  PartnerInvitationsControllerFactory.create()

const controllerRouter = Router()

controllerRouter.post(
  '/invite/response',
  (req: Request, res: Response, next: NextFunction) =>
    partnerInvitationsController.respondToInvitation(req, res, next),
)

controllerRouter.get(
  '/invite',
  (req: Request, res: Response, next: NextFunction) =>
    partnerInvitationsController.getInvitationsOfUser(req, res, next),
)

controllerRouter.post(
  '/invite',
  (req: Request, res: Response, next: NextFunction) =>
    partnerInvitationsController.inviteUser(req, res, next),
)

controllerRouter.post('/', (req: Request, res: Response, next: NextFunction) =>
  partnerController.create(req, res, next),
)

controllerRouter.get('/', (req: Request, res: Response, next: NextFunction) =>
  partnerController.getAll(req, res, next),
)

controllerRouter.get(
  '/:partnerId',
  (req: Request, res: Response, next: NextFunction) =>
    partnerController.getOne(req, res, next),
)

export { controllerRouter }
