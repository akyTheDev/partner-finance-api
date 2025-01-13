import { partnersDetail } from '../../../../tests/partners/fixture/partner-detail.fixture'
import { NotFoundError } from '../../../common'
import { PartnerRepository } from '../repository'
import { PartnerService } from './partner.service'

describe('PartnerService', () => {
  let partnerRepositoryMock: jest.Mocked<PartnerRepository>
  let partnerService: PartnerService

  beforeEach(() => {
    partnerRepositoryMock = {
      create: jest.fn().mockResolvedValue(undefined),
      getPartnersOfUser: jest.fn().mockResolvedValue({}),
    } as unknown as jest.Mocked<PartnerRepository>

    partnerService = new PartnerService(partnerRepositoryMock)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should insert the partner into the DB', async () => {
      await partnerService.create(1234, {
        name: 'Test Partner 1',
      })

      expect(partnerRepositoryMock.create).toHaveBeenCalledWith({
        userIds: [1234],
        name: 'Test Partner 1',
      })
    })
  })

  describe('getAll', () => {
    it('should throw error if no partner found', async () => {
      await expect(partnerService.getAll(1234)).rejects.toThrow(NotFoundError)

      expect(partnerRepositoryMock.getPartnersOfUser).toHaveBeenCalledWith(
        1234,
        undefined,
      )
    })

    it('should return the partners of the user', async () => {
      partnerRepositoryMock.getPartnersOfUser.mockResolvedValueOnce(
        partnersDetail,
      )

      const result = await partnerService.getAll(1234)

      expect(result).toEqual(partnersDetail)

      expect(partnerRepositoryMock.getPartnersOfUser).toHaveBeenCalledWith(
        1234,
        undefined,
      )
    })
  })

  describe('getOne', () => {
    it('should throw error if the partner could not be found', async () => {
      await expect(partnerService.getOne(1234, 123)).rejects.toThrow(
        NotFoundError,
      )

      expect(partnerRepositoryMock.getPartnersOfUser).toHaveBeenCalledWith(
        1234,
        123,
      )
    })

    it('should return the selected partner', async () => {
      partnerRepositoryMock.getPartnersOfUser.mockResolvedValueOnce(
        partnersDetail,
      )

      const result = await partnerService.getOne(1234, 123)

      expect(result).toEqual(partnersDetail[123])

      expect(partnerRepositoryMock.getPartnersOfUser).toHaveBeenCalledWith(
        1234,
        123,
      )
    })
  })
})
