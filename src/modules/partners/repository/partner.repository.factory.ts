import { PartnerRepository } from './partner.repository'

/* istanbul ignore file */
export class PartnerRepositoryFactory {
  private static repository: PartnerRepository

  static create(): PartnerRepository {
    if (!this.repository) {
      this.repository = new PartnerRepository()
    }
    return this.repository
  }
}
