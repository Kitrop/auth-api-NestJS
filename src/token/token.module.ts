import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { MongooseModule } from '@nestjs/mongoose'
import { Token, TokenSchema } from '../schemas/token.schema'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    JwtModule.register({} ),
    ConfigModule
  ],
  providers: [TokenService],
  exports: [TokenService]
})
export class TokenModule {}
