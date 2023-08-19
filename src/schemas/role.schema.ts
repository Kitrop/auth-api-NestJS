import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'

export type RoleDocument = Role & Document

@Schema()
export class Role {
  @ApiProperty({ example: 'admin', description: 'user role' })
  @Prop({
    unique: true,
    required: true,
  })
  value: string
}



export const RoleSchema = SchemaFactory.createForClass(Role)