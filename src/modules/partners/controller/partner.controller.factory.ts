import { PartnerServiceFactory } from '../service'
import { PartnerController } from './partner.controller'

/* istanbul ignore file */
export class PartnerControllerFactory {
  static create(): PartnerController {
    const service = PartnerServiceFactory.create()
    return new PartnerController(service)
  }
}
