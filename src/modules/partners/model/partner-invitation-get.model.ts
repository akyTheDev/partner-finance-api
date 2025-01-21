import { InvitationStatus } from '../types'

export interface PartnerInvitationGetModel {
  partner_id: number
  partner_name: string

  inviter_user_name: string
  inviter_user_email: string

  status: InvitationStatus

  time: string
}

export type PartnerInvitationsGetModel = PartnerInvitationGetModel[]
