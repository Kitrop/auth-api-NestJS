import { Module } from '@nestjs/common'
import { RolesService } from './roles.service'
import { RolesController } from './roles.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Role, RoleSchema } from '../schemas/role.schema'
import { User, UserSchema } from '../schemas/user.schema'
import { RolesGuard } from './roles.guard'
import { Roles } from './roles.decorator'
import { JwtModule } from '@nestjs/jwt'
import { TokenModule } from '../token/token.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }, {
      name: User.name,
      schema: UserSchema,
    }]),
    JwtModule.register({}),
    TokenModule,
    ConfigModule
  ],
  providers: [RolesService, RolesGuard],
  controllers: [RolesController],
  exports: [RolesGuard],
})
export class RolesModule {
}
