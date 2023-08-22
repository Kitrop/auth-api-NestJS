import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from '../schemas/user.schema'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { RolesModule } from '../roles/roles.module'
import { JwtAuthGuard } from './jwt-auth.guard'
import { ConfigModule } from '@nestjs/config'
import { Token, TokenSchema } from '../schemas/token.schema'
import { TokenModule } from '../token/token.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RolesModule,
    TokenModule,
    JwtModule.register({} ),
    ConfigModule
  ],
  providers: [AuthService, JwtAuthGuard],
  controllers: [AuthController]
})
export class AuthModule {}
