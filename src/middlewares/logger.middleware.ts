import { Request, Response, NextFunction } from 'express'

import { logger } from '../common'

export const loggerMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  logger.info(`${req.method} ${req.url}`)
  next()
}
