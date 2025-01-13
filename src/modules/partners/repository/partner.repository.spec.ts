import { PartnerRepository } from './partner.repository'
import { faker } from '@faker-js/faker'
import { psqlKnexConnection } from '../../../common/database/connection'

describe('PartnerRepository', () => {
  let repository: PartnerRepository

  beforeEach(() => {
    repository = new PartnerRepository()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be instantiated without any problem', async () => {
    expect(repository).toBeInstanceOf(PartnerRepository)
  })

  describe('create', () => {
    it('should insert given partner with users', async () => {
      const partnerName = faker.string.alpha(10)
      try {
        await repository.create({
          userIds: [1],
          name: partnerName,
        })

        const partnerQueryResult = await psqlKnexConnection('partners')
          .select('*')
          .where({
            name: partnerName,
          })

        expect(partnerQueryResult.length).toBe(1)
        expect(partnerQueryResult[0].name).toBe(partnerName)

        const partnerUserQueryResult = await psqlKnexConnection(
          'partners_users',
        )
          .select('*')
          .where({
            partner_id: partnerQueryResult[0].id,
          })

        expect(partnerUserQueryResult.length).toBe(1)
        expect(partnerUserQueryResult[0].user_id).toBe(1)
      } finally {
        await psqlKnexConnection('partners').where({ name: partnerName }).del()
      }
    })
  })

  describe('getPartnersOfUser', () => {
    it('should fetch all partners of the user correctly', async () => {
      const result = await repository.getPartnersOfUser(1)

      expect(Object.keys(result).length).toEqual(2)

      expect(result[10]?.id).toEqual(10)
      expect(result[10]?.name).toEqual('Test Partner 10')
      expect(result[10]?.users).toEqual({
        1: {
          id: 1,
          name: 'Test User 1',
          email: 'test1@test.com',
        },
        2: {
          id: 2,
          name: 'Test User 2',
          email: 'test2@test.com',
        },
      })

      expect(result[20]?.id).toEqual(20)
      expect(result[20]?.name).toEqual('Test Partner 20')
      expect(result[20]?.users).toEqual({
        1: {
          id: 1,
          name: 'Test User 1',
          email: 'test1@test.com',
        },
      })
    })

    it('should fetch one partner if partnerId is given', async () => {
      const result = await repository.getPartnersOfUser(1, 10)

      expect(Object.keys(result).length).toEqual(1)

      expect(result[10]?.id).toEqual(10)
      expect(result[10]?.name).toEqual('Test Partner 10')
      expect(result[10]?.users).toEqual({
        1: {
          id: 1,
          name: 'Test User 1',
          email: 'test1@test.com',
        },
        2: {
          id: 2,
          name: 'Test User 2',
          email: 'test2@test.com',
        },
      })
    })
  })
})
