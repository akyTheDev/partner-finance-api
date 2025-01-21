import { PartnerInvitationsGetModel } from '../../../src/modules/partners/model'
import { InvitationStatus } from '../../../src/modules/partners/types'

export const partnerInvitations = [
  {
    partner_id: 20,
    partner_name: 'Test Partner 20',
    inviter_user_name: 'Test User 1',
    inviter_user_email: 'test1@test.com',
    status: InvitationStatus.DECLINED,
    time: '2025-01-03T05:00:12Z',
  },
  {
    partner_id: 20,
    partner_name: 'Test Partner 20',
    inviter_user_name: 'Test User 1',
    inviter_user_email: 'test1@test.com',
    status: InvitationStatus.PENDING,
    time: '2025-01-03T05:00:12Z',
  },
] as PartnerInvitationsGetModel
