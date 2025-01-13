import { IsString, MaxLength, MinLength } from 'class-validator'

export class PartnerCreateDto {
  @IsString()
  @MaxLength(25)
  @MinLength(3)
  name!: string
}
