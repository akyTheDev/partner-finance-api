import { ForbiddenError } from '../../../common'
import { InviteDto, ResponseInvitationDto } from '../dto'
import { PartnerInvitationsGetModel } from '../model'
import { PartnerInvitationsRepository, PartnerRepository } from '../repository'
import { InvitationStatus } from '../types'

export class PartnerInvitationsService {
  constructor(
    private readonly partnerRepository: PartnerRepository,
    private readonly partnerInvitationsRepository: PartnerInvitationsRepository,
  ) {}

  /**
   * Invite the given user to the partner.
   *
   * @param userId - The inviter user id.
   * @param inviteDto - The invite dto that includes the partner id
   *    and the invitee user id.
   * @returns Void
   * @throws {ForbiddenError} if the user is not authorized to invite,
   *    {NotFoundError} if the invitee user not found.
   */
  async inviteUserToPartner(
    userId: number,
    inviteDto: InviteDto,
  ): Promise<void> {
    await this.checkAuthOfPartner(userId, inviteDto.partnerId)

    await this.partnerInvitationsRepository.create({
      invitee_user_email: inviteDto.email,
      inviter_user_id: userId,
      partner_id: inviteDto.partnerId,
      status: InvitationStatus.PENDING,
    })
  }

  /**
   * Get all invitations of the given user.
   *
   * @param userId - The ID of the user to filter.
   * @param status - The status of the invitation to filter.
   * @returns The list of invitations.
   * @throws {NotFoundError} if there is no invitation found.
   */
  async getAllInvitationsOfUser(
    userId: number,
    status: InvitationStatus | undefined = undefined,
  ): Promise<PartnerInvitationsGetModel> {
    return await this.partnerInvitationsRepository.getAllInvitationsOfUser(
      userId,
      status,
    )
  }

  /**
   * Respond to the invitation.
   *
   * @param userId - The user id who wants to respond.
   * @param responseInvitationDto - The response invitation dto.
   * @returns void
   * @throws {NotFoundError} if there is no invitation found.
   */
  async respondToInvitation(
    userId: number,
    responseInvitationDto: ResponseInvitationDto,
  ): Promise<void> {
    const { partnerId, isAccepted } = responseInvitationDto
    await this.partnerInvitationsRepository.respondToInvitation(
      userId,
      partnerId,
      isAccepted,
    )
  }

  /**
   * Check authorization of the user for the given partner.
   *
   * @param userId - The user id to check auth.
   * @param partnerId - The partner id to check auth.
   * @returns Void
   * @throws {ForbiddenError} If the user is not authorized to access to
   *  the partner.
   */
  private async checkAuthOfPartner(
    userId: number,
    partnerId: number,
  ): Promise<void> {
    const partners = await this.partnerRepository.getPartnersOfUser(
      userId,
      partnerId,
    )
    if (Object.keys(partners).length === 0) {
      throw new ForbiddenError()
    }
  }
}
