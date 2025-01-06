import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

export class UserRegisterDto {
  @IsEmail()
  email!: string

  @IsString()
  @MinLength(8)
  password!: string

  @IsString()
  @MaxLength(25)
  @MinLength(3)
  name!: string
}
