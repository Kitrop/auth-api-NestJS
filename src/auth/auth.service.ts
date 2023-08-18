import { BadRequestException, Injectable } from '@nestjs/common'
import { UserDto } from '../dto/user.dto'
import { User, UserDocument } from '../schemas/user.schema.'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { hash } from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
  }

  // Создаем нового пользователя
  async createUser(user: UserDto) {
    const findUser = await this.userModel.findOne({ email: user.email })
    if (findUser) {
      throw new BadRequestException('This user already existed')
    }

    const hashPassword = await hash(user.password, 5)

    const newUser = await this.userModel.create({
      email: user.email,
      password: hashPassword,
    })
    return {
      _id: newUser._id,
      email: newUser.email,
    }
  }
  async getUsers() {
    const users = await this.userModel.find()
    return users.map((u) => {
      return {
        _id: u._id,
        email: u.email,
        banned: u.banned,
        banReason: u.banReason,
      }
    })
  }
}
