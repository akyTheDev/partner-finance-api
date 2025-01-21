import { NextFunction, Request, Response } from 'express'

import { PartnerInvitationsService } from '../service'
import { PartnerInvitationsController } from './partner-invitations.controller'
import { partnerInvitations } from '../../../../tests/partners/fixture/partner-invitations.fixture'

describe('PartnerInvitationsController', () => {
  let serviceMock: jest.Mocked<PartnerInvitationsService>
  let controller: PartnerInvitationsController

  let req: Partial<Request>
  let res: Partial<Response>
  let nextFunction: jest.Mocked<NextFunction>

  beforeEach(() => {
    serviceMock = {
      inviteUserToPartner: jest.fn().mockResolvedValue(undefined),
      getAllInvitationsOfUser: jest.fn().mockResolvedValue(partnerInvitations),
      respondToInvitation: jest.fn().mockResolvedValue(undefined),
    } as any as jest.Mocked<PartnerInvitationsService>

    controller = new PartnerInvitationsController(serviceMock)

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

  describe('inviteUser', () => {
    beforeEach(() => {
      req.body = {
        partnerId: 456,
        email: 'test789@test.com',
      }
    })

    it('should return 201', async () => {
      await controller.inviteUser(
        req as Request,
        res as Response,
        nextFunction as NextFunction,
      )

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Ok',
      })

      expect(serviceMock.inviteUserToPartner).toHaveBeenCalledWith(1234, {
        partnerId: 456,
        email: 'test789@test.com',
      })

      expect(nextFunction).not.toHaveBeenCalled()
    })

    it('should call next if service throws', async () => {
      const err = new Error('test error')
      serviceMock.inviteUserToPartner.mockRejectedValueOnce(err)

      await controller.inviteUser(
        req as Request,
        res as Response,
        nextFunction as NextFunction,
      )

      expect(nextFunction).toHaveBeenCalledWith(err)
    })
  })

  describe('getInvitationsOfUser', () => {
    it('should return 200', async () => {
      await controller.getInvitationsOfUser(
        req as Request,
        res as Response,
        nextFunction as NextFunction,
      )

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(partnerInvitations)

      expect(serviceMock.getAllInvitationsOfUser).toHaveBeenCalledWith(
        1234,
        undefined,
      )

      expect(nextFunction).not.toHaveBeenCalled()
    })

    it('should call next if service throws', async () => {
      const err = new Error('test error')
      serviceMock.getAllInvitationsOfUser.mockRejectedValueOnce(err)

      await controller.getInvitationsOfUser(
        req as Request,
        res as Response,
        nextFunction as NextFunction,
      )

      expect(nextFunction).toHaveBeenCalledWith(err)
    })
  })

  describe('respondToInvitation', () => {
    beforeEach(() => {
      req.body = {
        partnerId: 592,
        isAccepted: true,
      }
    })

    it('should return 201', async () => {
      await controller.respondToInvitation(
        req as Request,
        res as Response,
        nextFunction as NextFunction,
      )

      expect(serviceMock.respondToInvitation).toHaveBeenCalledWith(1234, {
        partnerId: 592,
        isAccepted: true,
      })

      expect(nextFunction).not.toHaveBeenCalled()
    })

    it('should call next if service throws', async () => {
      const err = new Error('test error')
      serviceMock.respondToInvitation.mockRejectedValueOnce(err)

      await controller.respondToInvitation(
        req as Request,
        res as Response,
        nextFunction as NextFunction,
      )

      expect(nextFunction).toHaveBeenCalledWith(err)
    })
  })
})
