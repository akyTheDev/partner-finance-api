import { partnersDetail } from '../../../../tests/partners/fixture/partner-detail.fixture'
import { partnerInvitations } from '../../../../tests/partners/fixture/partner-invitations.fixture'
import { ForbiddenError } from '../../../common'
import { PartnerInvitationsRepository, PartnerRepository } from '../repository'
import { InvitationStatus } from '../types'
import { PartnerInvitationsService } from './partner-invitations.service'

describe('PartnerInvitationsService', () => {
  let partnerRepositoryMock: jest.Mocked<PartnerRepository>
  let partnerInvitationsRepositoryMock: jest.Mocked<PartnerInvitationsRepository>
  let partnerInvitationsService: PartnerInvitationsService

  beforeEach(() => {
    partnerRepositoryMock = {
      getPartnersOfUser: jest.fn().mockResolvedValue(partnersDetail),
    } as unknown as jest.Mocked<PartnerRepository>

    partnerInvitationsRepositoryMock = {
      create: jest.fn().mockResolvedValue(undefined),
      getAllInvitationsOfUser: jest.fn().mockResolvedValue(partnerInvitations),
      respondToInvitation: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<PartnerInvitationsRepository>

    partnerInvitationsService = new PartnerInvitationsService(
      partnerRepositoryMock,
      partnerInvitationsRepositoryMock,
    )
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('inviteUserToPartner', () => {
    it('should throw forbidden error if inviter user not in the partner', async () => {
      partnerRepositoryMock.getPartnersOfUser.mockResolvedValue({})

      await expect(
        partnerInvitationsService.inviteUserToPartner(12, {
          email: 'test-user@test.com',
          partnerId: 1,
        }),
      ).rejects.toThrow(ForbiddenError)

      expect(partnerInvitationsRepositoryMock.create).not.toHaveBeenCalled()
      expect(partnerRepositoryMock.getPartnersOfUser).toHaveBeenCalledWith(
        12,
        1,
      )
    })

    it('should correctly call repositories', async () => {
      await partnerInvitationsService.inviteUserToPartner(12, {
        email: 'test-user2@test.com',
        partnerId: 1,
      })

      expect(partnerInvitationsRepositoryMock.create).toHaveBeenCalledWith({
        inviter_user_id: 12,
        invitee_user_email: 'test-user2@test.com',
        partner_id: 1,
        status: InvitationStatus.PENDING,
      })

      expect(partnerRepositoryMock.getPartnersOfUser).toHaveBeenCalledWith(
        12,
        1,
      )
    })
  })

  describe('getAllInvitationsOfUser', () => {
    it('should call correctly when status not given', async () => {
      const result = await partnerInvitationsService.getAllInvitationsOfUser(12)
      expect(result).toEqual(partnerInvitations)

      expect(
        partnerInvitationsRepositoryMock.getAllInvitationsOfUser,
      ).toHaveBeenCalledWith(12, undefined)
    })

    it('should call correctly when status given', async () => {
      const result = await partnerInvitationsService.getAllInvitationsOfUser(
        12,
        InvitationStatus.DECLINED,
      )
      expect(result).toEqual(partnerInvitations)
    })
  })

  describe('respondToInvitation', () => {
    it('should call correctly repository function', async () => {
      await partnerInvitationsService.respondToInvitation(123, {
        partnerId: 987,
        isAccepted: false,
      })

      expect(
        partnerInvitationsRepositoryMock.respondToInvitation,
      ).toHaveBeenCalledWith(123, 987, false)
    })
  })
})
