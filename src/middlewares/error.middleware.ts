import { Request, Response, NextFunction } from 'express'

import { AppError, logger } from '../common'

export const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const status = err.statusCode || 500
  const message = status !== 500 ? err.message : 'Internal Server Error'

  logger.error(
    `Error occurred during ${req.method} ${req.url}: Error: ${JSON.stringify(err)}`,
  )

  res.status(status).json({
    message,
  })
}
