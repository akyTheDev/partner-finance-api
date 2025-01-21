import { InvitationStatus } from '../types'

export interface PartnerInvitationModel {
  inviter_user_id: number
  invitee_user_email?: string
  invitee_user_id: number
  partner_id: number
  status: InvitationStatus
}
