import { PartnerInvitationsRepository } from './partner-invitations.repository'

/* istanbul ignore file */
export class PartnerInvitationsRepositoryFactory {
  private static repository: PartnerInvitationsRepository

  static create(): PartnerInvitationsRepository {
    if (!this.repository) {
      this.repository = new PartnerInvitationsRepository()
    }
    return this.repository
  }
}
