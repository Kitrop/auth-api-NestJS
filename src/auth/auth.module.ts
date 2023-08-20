import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from '../schemas/user.schema'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { JwtAuthGuard } from '../token/jwt-auth.guard'
import { RolesModule } from '../roles/roles.module'
import { TokenModule } from '../token/token.module'

console.log(process.env.DB_URL)
@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://veryyoshicool:2oJOUiiYj3xYNJXW@cluster0.qz3ho2g.mongodb.net/?retryWrites=true&w=majority'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: 'secretKey',
      signOptions: {
        expiresIn: '24h',
      },
    }),
    RolesModule,
    TokenModule
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
