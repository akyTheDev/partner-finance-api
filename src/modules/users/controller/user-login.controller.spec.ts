import { NextFunction, Request, Response } from 'express'

import { UserLoginService } from '../service'
import { UserLoginController } from './user-login.controller'

describe('UserLoginController', () => {
  let serviceMock: jest.Mocked<UserLoginService>
  let controller: UserLoginController

  let req: Partial<Request>
  let res: Partial<Response>
  let nextFunction: jest.Mocked<NextFunction>

  const mockLoginServiceResult = {
    access_token: 'token',
    token_type: 'bearer',
  }

  beforeEach(() => {
    serviceMock = {
      login: jest.fn().mockResolvedValue(mockLoginServiceResult),
    } as Partial<jest.Mocked<UserLoginService>> as jest.Mocked<UserLoginService>

    controller = new UserLoginController(serviceMock)

    req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any as Partial<Response>

    nextFunction = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('register', () => {
    it('should return 201', async () => {
      await controller.login(
        req as Request,
        res as Response,
        nextFunction as NextFunction,
      )

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(mockLoginServiceResult)

      expect(serviceMock.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(nextFunction).not.toHaveBeenCalled()
    })

    it('should call next if service throws', async () => {
      const err = new Error('test error')
      serviceMock.login.mockRejectedValueOnce(err)

      await controller.login(
        req as Request,
        res as Response,
        nextFunction as NextFunction,
      )

      expect(nextFunction).toHaveBeenCalledWith(err)
    })
  })
})
