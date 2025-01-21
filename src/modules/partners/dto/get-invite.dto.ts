import { IsEnum, IsOptional } from 'class-validator'

import { InvitationStatus } from '../types'

export class GetInviteDto {
  @IsOptional()
  @IsEnum(InvitationStatus)
  status!: InvitationStatus
}
