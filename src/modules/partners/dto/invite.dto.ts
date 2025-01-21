import { Transform } from 'class-transformer'
import { IsNumber, IsPositive, IsEmail } from 'class-validator'

export class InviteDto {
  @IsEmail()
  email!: string

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  partnerId!: number
}
