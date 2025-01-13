import { NextFunction, Request, Response } from 'express'

import { PartnerService } from '../service'
import { PartnerController } from './partner.controller'
import { partnersDetail } from '../../../../tests/partners/fixture/partner-detail.fixture'

describe('PartnerController', () => {
  let serviceMock: jest.Mocked<PartnerService>
  let controller: PartnerController

  let req: Partial<Request>
  let res: Partial<Response>
  let nextFunction: jest.Mocked<NextFunction>

  beforeEach(() => {
    serviceMock = {
      create: jest.fn().mockResolvedValue(undefined),
      getAll: jest.fn().mockResolvedValue(partnersDetail),
      getOne: jest.fn().mockResolvedValue(partnersDetail[123]),
    } as any as jest.Mocked<PartnerService>

    controller = new PartnerController(serviceMock)

    req = {
      body: {},
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        userId: 1234,
      },
    } as any as Partial<Response>

    nextFunction = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should return 201', async () => {
      req.body = {
        name: 'Partner Name',
      }
      await controller.create(
        req as Request,
        res as Response,
        nextFunction as NextFunction,
      )

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Ok',
      })

      expect(serviceMock.create).toHaveBeenCalledWith(1234, {
        name: 'Partner Name',
      })

      expect(nextFunction).not.toHaveBeenCalled()
    })

    it('should call next if service throws', async () => {
      req.body = {
        name: 'Partner Name',
      }

      const err = new Error('test error')
      serviceMock.create.mockRejectedValueOnce(err)

      await controller.create(
        req as Request,
        res as Response,
        nextFunction as NextFunction,
      )

      expect(nextFunction).toHaveBeenCalledWith(err)
    })
  })

  describe('getAll', () => {
    it('should return 200', async () => {
      await controller.getAll(
        req as Request,
        res as Response,
        nextFunction as NextFunction,
      )

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(partnersDetail)

      expect(serviceMock.getAll).toHaveBeenCalledWith(1234)
      expect(nextFunction).not.toHaveBeenCalled()
    })

    it('should call next if service throws', async () => {
      const err = new Error('test error')
      serviceMock.getAll.mockRejectedValueOnce(err)

      await controller.getAll(
        req as Request,
        res as Response,
        nextFunction as NextFunction,
      )

      expect(nextFunction).toHaveBeenCalledWith(err)
    })
  })

  describe('getOne', () => {
    it('should return 200', async () => {
      req.params = {
        partnerId: '123',
      }
      await controller.getOne(
        req as Request,
        res as Response,
        nextFunction as NextFunction,
      )

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(partnersDetail[123])

      expect(serviceMock.getOne).toHaveBeenCalledWith(1234, 123)
      expect(nextFunction).not.toHaveBeenCalled()
    })

    it('should call next if service throws', async () => {
      req.params = {
        partnerId: '123',
      }
      const err = new Error('test error')
      serviceMock.getOne.mockRejectedValueOnce(err)

      await controller.getOne(
        req as Request,
        res as Response,
        nextFunction as NextFunction,
      )

      expect(nextFunction).toHaveBeenCalledWith(err)
    })
  })
})
