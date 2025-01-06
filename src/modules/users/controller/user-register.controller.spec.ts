import { NextFunction, Request, Response } from 'express'

import { UserRegisterService } from '../service'
import { UserRegisterController } from './user-register.controller'

describe('UserRegisterController', () => {
  let serviceMock: jest.Mocked<UserRegisterService>
  let controller: UserRegisterController

  let req: Partial<Request>
  let res: Partial<Response>
  let nextFunction: jest.Mocked<NextFunction>

  beforeEach(() => {
    serviceMock = {
      register: jest.fn().mockResolvedValue(undefined),
    } as Partial<
      jest.Mocked<UserRegisterService>
    > as jest.Mocked<UserRegisterService>

    controller = new UserRegisterController(serviceMock)

    req = {
      body: {
        name: 'Controller Test User',
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
      await controller.register(
        req as Request,
        res as Response,
        nextFunction as NextFunction,
      )

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Ok',
      })

      expect(serviceMock.register).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        name: 'Controller Test User',
      })

      expect(nextFunction).not.toHaveBeenCalled()
    })

    it('should call next if service throws', async () => {
      const err = new Error('test error')
      serviceMock.register.mockRejectedValueOnce(err)

      await controller.register(
        req as Request,
        res as Response,
        nextFunction as NextFunction,
      )

      expect(nextFunction).toHaveBeenCalledWith(err)
    })
  })
})
