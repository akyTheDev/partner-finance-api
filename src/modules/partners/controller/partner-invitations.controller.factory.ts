import { PartnerInvitationsServiceFactory } from '../service'
import { PartnerInvitationsController } from './partner-invitations.controller'

/* istanbul ignore file */
export class PartnerInvitationsControllerFactory {
  static create(): PartnerInvitationsController {
    const service = PartnerInvitationsServiceFactory.create()
    return new PartnerInvitationsController(service)
  }
}
