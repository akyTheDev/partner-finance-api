import { PartnerRepositoryFactory } from '../repository'
import { PartnerService } from './partner.service'

/* istanbul ignore file */
export class PartnerServiceFactory {
  static create(): PartnerService {
    const partnerRepository = PartnerRepositoryFactory.create()
    return new PartnerService(partnerRepository)
  }
}
