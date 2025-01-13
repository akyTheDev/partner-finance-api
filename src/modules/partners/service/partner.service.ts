import { NotFoundError } from '../../../common'
import { PartnerCreateDto } from '../dto'
import { PartnersGetModel, PartnerGetModel } from '../model'
import { PartnerRepository } from '../repository'

export class PartnerService {
  constructor(private readonly partnerRepository: PartnerRepository) {}

  /**
   * Create a new partner.
   *
   * @param userId - The ID of the user creating the partner.
   * @param partnerCreateDto - The data to create the partner.
   * @returns void
   */
  async create(
    userId: number,
    partnerCreateDto: PartnerCreateDto,
  ): Promise<void> {
    await this.partnerRepository.create({
      userIds: [userId],
      name: partnerCreateDto.name,
    })
  }

  /**
   * Get all partners' detail of the user.
   *
   * @param userId - The user id that should be filtered.
   * @returns The details of the partners.
   * @throw {NotFoundError} if no partner found.
   */
  async getAll(userId: number): Promise<PartnersGetModel> {
    return this.getPartnersFromDb(userId)
  }

  /**
   * Get the selected partner detail of the user.
   *
   * @param userId - The id of the user to filter.
   * @param partnerId - The partner id to filter.
   * @returns The detail of the partner.
   * @throws {NotFoundError} if the partner not found.
   */
  async getOne(userId: number, partnerId: number): Promise<PartnerGetModel> {
    const partner = await this.getPartnersFromDb(userId, partnerId)
    return partner[partnerId]!
  }

  /**
   * Get partners from database.
   *
   * @param userId - The id of the user to filter.
   * @param partnerId - The partner id to filter.
   * @returns The partners info.
   * @throws {NotFoundError} if no partner found
   */
  private async getPartnersFromDb(
    userId: number,
    partnerId: number | undefined = undefined,
  ): Promise<PartnersGetModel> {
    const partners = await this.partnerRepository.getPartnersOfUser(
      userId,
      partnerId,
    )
    if (Object.keys(partners).length === 0) {
      throw new NotFoundError('No partner found!')
    }
    return partners
  }
}
