import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Role, RoleDocument } from '../schemas/role.schema'
import { Model } from 'mongoose'
import { CreateRoleDto } from '../dto/role.dto'
import { User, UserDocument } from '../schemas/user.schema'

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async createRole(createRoleDto: CreateRoleDto) {
    const findRole = await this.roleModel.findOne({ value: createRoleDto.value })
    if (findRole) {
      throw new BadRequestException('This role already existed')
    }
    const newRole = await this.roleModel.create({ value: createRoleDto.value })
    return newRole
  }

  async getRole(value: string, email: string) {
    const findUser = await this.userModel.findOne({ email })
    if (!findUser) throw new BadRequestException('User not found')


    const findRole = await this.roleModel.findOne({ value })
    if (!findRole) throw new BadRequestException('Role not found')

    findUser.role = value

    return findUser.save()
  }
}
