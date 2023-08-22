import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { IS_MONGO_ID, IsString } from 'class-validator'

export type TokenDocument = Document & Token

@Schema()
export class Token {
  @IsString()
  _id: string

  @Prop()
  accessToken: string

  @Prop()
  refreshToken: string
}

export const TokenSchema = SchemaFactory.createForClass(Token)