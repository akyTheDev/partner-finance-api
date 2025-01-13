import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { ForbiddenError, UnauthorizedError } from '../common'
import { config } from '../common/config'

const JWT_SECRET = config.JWT_SECRET
const excludedPaths = ['/users/login', '/users/register']

/**
 * Middleware to authenticate a user using the Authorization header.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (excludedPaths.includes(req.path)) {
    return next()
  }

  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Unauthorized: Missing or invalid token')
  }

  const token: string = authHeader.split(' ')[1]!

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    if (!decoded.userId) {
      throw new Error()
    }
    res.locals.userId = decoded.userId
    next()
  } catch {
    throw new ForbiddenError('Forbidden: Invalid or expired token')
  }
}
