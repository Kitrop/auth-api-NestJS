import { Module } from '@nestjs/common'
import { RolesService } from './roles.service'
import { RolesController } from './roles.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Role, RoleSchema } from '../schemas/role.schema'
import { User, UserSchema } from '../schemas/user.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }, { name: User.name, schema: UserSchema }])],
  providers: [RolesService],
  controllers: [RolesController]
})
export class RolesModule {}
