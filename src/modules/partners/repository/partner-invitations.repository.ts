import { BaseRepository, NotFoundError } from '../../../common'
import { PartnerInvitationModel, PartnerInvitationsGetModel } from '../model'
import { InvitationStatus } from '../types'

export class PartnerInvitationsRepository extends BaseRepository<PartnerInvitationModel> {
  private readonly usersTableName: string = 'users'
  private readonly partnersTableName: string = 'partners'
  private readonly partnersUsersTableName: string = 'partners_users'

  constructor() {
    super('partners_invitations')
  }

  /**
   * Invite the given user to the partner.
   *
   * @param data - The data to insert.
   * @returns void
   * @throws {NotFoundError} if the invitee user not found.
   */
  override async create(
    data: Partial<PartnerInvitationModel>,
  ): Promise<PartnerInvitationModel> {
    data.invitee_user_id = await this.getInviteeUserId(data.invitee_user_email!)
    delete data.invitee_user_email
    return await super.create(data)
  }

  /**
   * Get all invitations of the given user.
   *
   * @param userId - The ID of the user to filter.
   * @param status - The status of the invitation to filter.
   * @returns The list of invitations.
   * @throw {NotFoundError} if there is no invitation found.
   */
  async getAllInvitationsOfUser(
    userId: number,
    status: InvitationStatus | undefined = undefined,
  ): Promise<PartnerInvitationsGetModel> {
    const query = this.connection(this.tableName)
      .leftJoin(
        this.usersTableName,
        `${this.tableName}.inviter_user_id`,
        `${this.usersTableName}.id`,
      )
      .leftJoin(
        this.partnersTableName,
        `${this.tableName}.partner_id`,
        `${this.partnersTableName}.id`,
      )
      .where(`${this.tableName}.invitee_user_id`, userId)
      .select(`${this.tableName}.partner_id as partner_id`)
      .select(`${this.partnersTableName}.name as partner_name`)
      .select(`${this.usersTableName}.name as inviter_user_name`)
      .select(`${this.usersTableName}.email as inviter_user_email`)
      .select(`${this.tableName}.status as  status`)
      .select(`${this.tableName}.created_at as time`)

    if (status !== undefined) {
      query.where(`${this.tableName}.status`, status)
    }

    const queryResult = (await query) as PartnerInvitationsGetModel

    if (queryResult.length === 0) {
      throw new NotFoundError('No invitations found')
    }

    return queryResult
  }

  /**
   * Respond to the invitation and update the invitation status.
   *
   * Firstly, update the partners_invitations table. Then, if
   * isAccepted true, add to the partners_users table.
   *
   * @param userId - The ID of the user.
   * @param partnerId - The partner id to filter.
   * @param isAccepted - The status of the invitation.
   * @returns void
   * @throws {NotFoundError} if there is no invitation found.
   */
  async respondToInvitation(
    userId: number,
    partnerId: number,
    isAccepted: boolean,
  ): Promise<void> {
    await this.connection.transaction(async (trx) => {
      const updatePartnersInvitationsTableQueryResult = await trx(
        this.tableName,
      )
        .where(`invitee_user_id`, userId)
        .andWhere(`partner_id`, partnerId)
        .andWhere(`status`, InvitationStatus.PENDING)
        .update({
          status: isAccepted
            ? InvitationStatus.ACCEPTED
            : InvitationStatus.DECLINED,
          updated_at: 'NOW()',
        })
        .returning(`id`)

      if (updatePartnersInvitationsTableQueryResult.length === 0) {
        throw new NotFoundError('No invitation found')
      }

      if (!isAccepted) {
        return
      }

      await trx(this.partnersUsersTableName).insert({
        partner_id: partnerId,
        user_id: userId,
      })
    })
  }

  /**
   * Check whether the given invitee user exists or not.
   *
   * @param inviteeUserId - The invitee user id.
   * @returns Void
   * @throws {NotFoundError} if the user not found.
   */
  private async getInviteeUserId(inviteeUserEmail: string): Promise<number> {
    const userQueryResult = await this.connection(this.usersTableName)
      .select('id')
      .where({
        email: inviteeUserEmail,
      })

    if (userQueryResult.length === 0) {
      throw new NotFoundError('User not found to invite')
    }

    return userQueryResult[0].id
  }
}
