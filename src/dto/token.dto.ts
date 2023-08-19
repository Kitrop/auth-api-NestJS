import { IsEmail, IsString } from 'class-validator'


export class GenerateTokenDto {
  @IsString()
  _id: string

  @IsEmail()
  email: string

  @IsString()
  role: string
}