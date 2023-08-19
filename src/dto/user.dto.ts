import { IsBoolean, IsEmail, IsString, Length, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UserDto {
  @ApiProperty({ example: 'user@email.com', description: 'user email', type: String })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'R#k9P&mS@7eY\n', description: 'user strong password', type: String })
  @IsString()
  @Length(4, 100)
  password: string
}

export class GetUsersDto {
  @ApiProperty({ example: 'user@email.com', description: 'user email', type: String })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'R#k9P&mS@7eY\n', description: 'user strong password', type: String })
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).*$/, {message: 'password too weak'})
  @Length(4, 100)
  password: string

  @ApiProperty({ example: true, description: 'user banned?', default: false, type: Boolean })
  @IsBoolean()
  banned: boolean

  @ApiProperty({
    example: 'Frequently submitted bugs', description: 'Reason for which the user is banned', default: ' ', type: String,
  })
  @IsString()
  banReason: string


  @ApiProperty({
    example: 'user role',
    description: 'ADMIN',
    default: 'USER',
    type: String,
  })
  @IsString()
  role: string
}

export class LoginUserDto {
  @IsString()
  email: string

  @IsString()
  password: string
}