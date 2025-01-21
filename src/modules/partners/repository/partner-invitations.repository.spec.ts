import { PartnerInvitationsRepository } from './partner-invitations.repository'
import { NotFoundError } from '../../../common'
import { psqlKnexConnection } from '../../../common/database/connection'
import { InvitationStatus } from '../types'

describe('PartnerInvitationsRepository', () => {
  let repository: PartnerInvitationsRepository

  beforeEach(() => {
    repository = new PartnerInvitationsRepository()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be instantiated without any problem', async () => {
    expect(repository).toBeInstanceOf(PartnerInvitationsRepository)
  })

  describe('create', () => {
    it('should throw not found error if the invitee user not found', async () => {
      await expect(
        repository.create({
          invitee_user_email: 'test24@test.com',
          inviter_user_id: 1,
          partner_id: 10,
          status: InvitationStatus.PENDING,
        }),
      ).rejects.toThrow(NotFoundError)
    })

    it('should insert the given data to the database correctly', async () => {
      try {
        await repository.create({
          invitee_user_email: 'test3@test.com',
          inviter_user_id: 2,
          partner_id: 10,
          status: InvitationStatus.PENDING,
        })

        const invitationsQueryResult = await psqlKnexConnection(
          'partners_invitations',
        )
          .select('*')
          .where({
            inviter_user_id: 2,
          })

        expect(invitationsQueryResult.length).toBe(1)
        expect(invitationsQueryResult[0].invitee_user_id).toBe(3)
      } finally {
        await psqlKnexConnection('partners_invitations').del().where({
          inviter_user_id: 2,
        })
      }
    })
  })

  describe('getAllInvitationsOfUser', () => {
    it('should throw not found error if there is no invitation found', async () => {
      await expect(repository.getAllInvitationsOfUser(1)).rejects.toThrow(
        NotFoundError,
      )
    })

    it('should return the all list of invitations if status not given', async () => {
      const result = await repository.getAllInvitationsOfUser(3)

      expect(result.length).toBe(2)

      expect(result[0]).toEqual({
        partner_id: 20,
        partner_name: 'Test Partner 20',
        inviter_user_name: 'Test User 1',
        inviter_user_email: 'test1@test.com',
        status: 'declined',
        time: expect.any(Date),
      })

      expect(result[1]).toEqual({
        partner_id: 20,
        partner_name: 'Test Partner 20',
        inviter_user_name: 'Test User 1',
        inviter_user_email: 'test1@test.com',
        status: 'pending',
        time: expect.any(Date),
      })
    })

    it('should return only asked status', async () => {
      const result = await repository.getAllInvitationsOfUser(
        3,
        InvitationStatus.DECLINED,
      )

      expect(result.length).toBe(1)

      expect(result[0]).toEqual({
        partner_id: 20,
        partner_name: 'Test Partner 20',
        inviter_user_name: 'Test User 1',
        inviter_user_email: 'test1@test.com',
        status: 'declined',
        time: expect.any(Date),
      })
    })
  })

  describe('respondToInvitation', () => {
    it('should not found error if there is no invitation found', async () => {
      await expect(repository.respondToInvitation(1, 1, true)).rejects.toThrow(
        NotFoundError,
      )
    })

    it('should update the invitation status and add to partners_users table when isAccepted true', async () => {
      try {
        await repository.respondToInvitation(3, 20, true)

        const checkPartnersInvitationsTableQueryResult =
          await psqlKnexConnection('partners_invitations').select('*').where({
            id: 3,
          })

        expect(checkPartnersInvitationsTableQueryResult[0].status).toBe(
          'accepted',
        )

        const checkPartnersUsersTableQueryResult = await psqlKnexConnection(
          'partners_users',
        )
          .select('*')
          .where({
            user_id: 3,
            partner_id: 20,
          })

        expect(checkPartnersUsersTableQueryResult.length).toBe(1)
        expect(checkPartnersUsersTableQueryResult[0].user_id).toBe(3)
        expect(checkPartnersUsersTableQueryResult[0].partner_id).toBe(20)
      } finally {
        await psqlKnexConnection('partners_users').del().where({
          user_id: 3,
          partner_id: 20,
        })

        await psqlKnexConnection('partners_invitations')
          .update({
            status: 'pending',
          })
          .where({
            id: 3,
          })
      }
    })

    it('should update the invitation status but not partners_users table when isAccepted false', async () => {
      try {
        await repository.respondToInvitation(3, 20, false)

        const checkPartnersInvitationsTableQueryResult =
          await psqlKnexConnection('partners_invitations').select('*').where({
            id: 3,
          })

        expect(checkPartnersInvitationsTableQueryResult[0].status).toBe(
          'declined',
        )

        const checkPartnersUsersTableQueryResult = await psqlKnexConnection(
          'partners_users',
        )
          .select('*')
          .where({
            user_id: 3,
            partner_id: 20,
          })

        expect(checkPartnersUsersTableQueryResult.length).toBe(0)
      } finally {
        await psqlKnexConnection('partners_invitations')
          .update({
            status: 'pending',
          })
          .where({
            id: 3,
          })
      }
    })
  })
})
