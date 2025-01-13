import { PartnerModel } from './partner.model'

interface User {
  id: number
  name: string
  email: string
}

export interface PartnerGetModel extends PartnerModel {
  id: number
  users: Record<number, User>
}

export type PartnersGetModel = Record<number, PartnerGetModel>
