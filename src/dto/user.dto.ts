import { IsBoolean, IsEmail, IsString, Length, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UserDto {
  @ApiProperty({ example: 'user@email.com', description: 'user email' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'R#k9P&mS@7eY\n', description: 'user strong password' })
  @IsString()
  @Length(4, 100)
  password: string
}

export class GetUsersDto {
  @ApiProperty({ example: 'user@email.com', description: 'user email' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'R#k9P&mS@7eY\n', description: 'user strong password' })
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).*$/, {message: 'password too weak'})
  @Length(4, 100)
  password: string

  @ApiProperty({ example: true, description: 'user banned?', default: false })
  @IsBoolean()
  banned: boolean

  @ApiProperty({
    example: 'Frequently submitted bugs',
    description: 'Reason for which the user is banned',
    default: ' ',
  })
  @IsString()
  banReason: string

  @IsString()
  role: string
}

export interface getUser {
  email: string
  password: string
  banned: boolean
  banReason: string
}
