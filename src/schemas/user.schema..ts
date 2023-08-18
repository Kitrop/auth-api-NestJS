import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'

export type UserDocument = User & Document

@Schema()
export class User {
  @ApiProperty({ example: 'user@email.com', description: 'user email' })
  @Prop({
    unique: true,
    required: true,
  })
  email: string
  @ApiProperty({
    example: 'R#k9P&mS@7eY\n', description: 'user strong password', })
  @Prop({ required: true })
  password: string

  @ApiProperty({
    example: 'true/false',
    description: 'user banned?',
  })
  @Prop({ default: false })
  banned: boolean

  @ApiProperty({
    example: 'Frequently submitted bugs',
    description: 'Reason for which the user is banned',
  })
  @Prop({ default: '' })
  banReason: string
}

export const UserSchema = SchemaFactory.createForClass(User)
