import { Transform } from 'class-transformer'
import { IsBoolean, IsNumber, IsPositive } from 'class-validator'

export class ResponseInvitationDto {
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  partnerId!: number

  @IsBoolean()
  isAccepted!: boolean
}
