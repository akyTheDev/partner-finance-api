import { BaseRepository } from '../../../common'
import { PartnerCreateModel, PartnerModel, PartnersGetModel } from '../model'

export class PartnerRepository extends BaseRepository<PartnerModel> {
  private readonly usersTableName: string = 'users'
  private readonly partnerUsersTableName: string = 'partners_users'

  constructor() {
    super('partners')
  }

  /**
   * Add a new partner to the database and assign the user to this partner.
   *
   * @param data - The data to insert.
   * @returns void
   */
  override async create(
    data: Partial<PartnerCreateModel>,
  ): Promise<PartnerCreateModel> {
    return await this.connection.transaction(async (trx) => {
      const [partner] = await trx(this.tableName)
        .insert({
          name: data.name,
        })
        .returning('id')

      if (data?.userIds && data?.userIds?.length > 0) {
        const userRecords = data.userIds.map((userId) => ({
          partner_id: partner.id,
          user_id: userId,
        }))

        await trx(this.partnerUsersTableName).insert(userRecords)
      }

      return {
        ...partner,
        userIds: data.userIds,
      }
    })
  }

  /**
   * Get details of partners of user.
   *
   * @param userId - The ID of the user to filter.
   * @param partnerId - The partner id to filter.
   * @returns The partners info.
   */
  async getPartnersOfUser(
    userId: number,
    partnerId: number | undefined = undefined,
  ): Promise<PartnersGetModel> {
    const query = this.connection(this.tableName)
      .select(
        `${this.tableName}.id as partner_id`,
        `${this.tableName}.name as partner_name`,
        `${this.usersTableName}.id as user_id`,
        `${this.usersTableName}.name as user_name`,
        `${this.usersTableName}.email as user_email`,
      )
      .leftJoin(
        this.partnerUsersTableName,
        `${this.tableName}.id`,
        `${this.partnerUsersTableName}.partner_id`,
      )
      .leftJoin(
        this.usersTableName,
        `${this.partnerUsersTableName}.user_id`,
        `${this.usersTableName}.id`,
      )
      .whereIn(
        `${this.tableName}.id`,
        this.connection(this.partnerUsersTableName)
          .select('partner_id')
          .where('user_id', userId),
      )

    if (partnerId) {
      query.where(`${this.tableName}.id`, partnerId)
    }

    const queryResult = await query

    const result: PartnersGetModel = {}

    for (const {
      partner_id,
      partner_name,
      user_id,
      user_name,
      user_email,
    } of queryResult) {
      if (!result[partner_id]) {
        result[partner_id] = {
          id: partner_id,
          name: partner_name,
          users: {},
        }
      }

      result[partner_id].users[user_id] = {
        id: user_id,
        name: user_name,
        email: user_email,
      }
    }

    return result
  }
}
