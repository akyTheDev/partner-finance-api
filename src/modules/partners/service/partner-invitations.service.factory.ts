import {
  PartnerRepositoryFactory,
  PartnerInvitationsRepositoryFactory,
} from '../repository'
import { PartnerInvitationsService } from './partner-invitations.service'

/* istanbul ignore file */
export class PartnerInvitationsServiceFactory {
  static create(): PartnerInvitationsService {
    const partnerRepository = PartnerRepositoryFactory.create()
    const partnerInvitationsRepository =
      PartnerInvitationsRepositoryFactory.create()
    return new PartnerInvitationsService(
      partnerRepository,
      partnerInvitationsRepository,
    )
  }
}
