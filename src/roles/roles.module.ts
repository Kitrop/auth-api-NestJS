import { Module } from '@nestjs/common'
import { RolesService } from './roles.service'
import { RolesController } from './roles.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Role, RoleSchema } from '../schemas/role.schema'
import { User, UserSchema } from '../schemas/user.schema'
import { RolesGuard } from './roles.guard'
import { Roles } from './roles.decorator'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }, {
    name: User.name,
    schema: UserSchema,
  }]), JwtModule.register({
    secret: 'secretKey',
    signOptions: {
      expiresIn: '24h',
    },
  })],
  providers: [RolesService, RolesGuard],
  controllers: [RolesController],
  exports: [RolesGuard],
})
export class RolesModule {
}
