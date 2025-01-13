import { Request, Response, NextFunction, Router } from 'express'

import { PartnerControllerFactory } from './controller'

const partnerController = PartnerControllerFactory.create()

const controllerRouter = Router()

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
