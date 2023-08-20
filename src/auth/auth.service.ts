import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { LoginUserDto, UserDto } from '../dto/user.dto'
import { User, UserDocument } from '../schemas/user.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { compare, hash } from 'bcrypt'
import { TokenService } from '../token/token.service'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly tokenService: TokenService
  ) {}

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
    return this.tokenService.generateToken({
      _id: newUser._id,
      email: newUser.email,
      role: newUser.role
    })
  }

  async loginUser(loginUser: LoginUserDto) {
    const candidate = await this.userModel.findOne({ email: loginUser.email })
    if (!candidate) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
    const isValid = await compare(loginUser.password , candidate.password)
    if (!isValid) {
      throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED)
    }
    return this.tokenService.generateToken({
      email: candidate.email,
      _id: candidate._id,
      role: candidate.role
    })
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
