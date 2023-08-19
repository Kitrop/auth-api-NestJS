import { IsEmail, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Prop, Schema } from '@nestjs/mongoose'

export class CreateRoleDto {
  @ApiProperty({ example: 'admin', description: 'user role', type: String })
  @IsString()
  value: string
}

@Schema()
export class GetRoleDto {

  @ApiProperty({
    example: 'user@email.com',
    description: 'Email address of the user to whom the role will be assigned',
    type: String
  })
  @IsEmail()
  email: string

  @ApiProperty({
    example: 'ADMIN',
    description: 'The role that will be given to the user',
    type: String
  })
  @IsString()
  value: string
}