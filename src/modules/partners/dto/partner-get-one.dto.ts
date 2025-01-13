import { Transform } from 'class-transformer'
import { IsNumber, IsPositive } from 'class-validator'

export class PartnerGetOneDto {
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  partnerId!: number
}
