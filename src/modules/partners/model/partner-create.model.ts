import { PartnerModel } from './partner.model'

export interface PartnerCreateModel extends PartnerModel {
  userIds: number[]
}
