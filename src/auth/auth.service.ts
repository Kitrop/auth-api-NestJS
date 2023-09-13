import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { LoginUserDto, UserDto } from '../dto/user.dto'
import { User, UserDocument } from '../schemas/user.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { compare, hash } from 'bcrypt'
import { GenerateTokenDto } from '../dto/token.dto'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Response } from 'express'
import { TokenService } from '../token/token.service'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {
  }

  // Создаем нового пользователя
  async createUser(user: UserDto) {
    // Находим есть ли уже такой пользователь
    const findUser = await this.userModel.findOne({ email: user.email })
    // Если пользователь уже существует
    if (findUser) throw new BadRequestException('This user already existed')

    // За хэшированный пароль
    const hashPassword = await hash(user.password, 5)

    // Создание пользователя
    const newUser = await this.userModel.create({
      email: user.email,
      password: hashPassword,
    })

    // Если пользователь не создан
    if (!newUser) throw new BadRequestException('User not created')

    // Генерируем jwt токены для пользователя
    const tokens = await this.generateToken({
      _id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    })

    // Сохраняем токены в БД
    await this.tokenService.saveToken(newUser._id, tokens)

    return {
      _id: newUser._id,
      email: newUser.email,
    }
  }

  // Логинизация пользователя
  async loginUser(res: Response, loginUser: LoginUserDto) {
    // Находим пользователя по email
    const candidate = await this.userModel.findOne({ email: loginUser.email })
    // Если пользователь не найден
    if (!candidate) throw new HttpException('User not found', HttpStatus.NOT_FOUND)

    // Сравниваем пароль, который пришел с хэшированным паролем из БД
    const isValid = await compare(loginUser.password, candidate.password)
    if (!isValid) throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED) // Если пароли расходятся

    // Генерация токена
    const token = await this.generateToken({
      email: candidate.email,
      _id: candidate._id,
      role: candidate.role,
    })

    // Сохранение токена в БД
    await this.tokenService.saveToken(candidate._id, token)

    // Добавление accessToken в cookie
    res.cookie('accessToken', token.accessToken, { httpOnly: false, sameSite: 'none'})

    return {
      email: candidate.email,
      _id: candidate._id,
      role: candidate.role,
    }
  }

  // Генерация токена
  async generateToken(user: GenerateTokenDto) {
    const tokens = this.getTokens(user.email, user._id, user.role)
    return tokens
  }

  // Генерация токена
  async getTokens(email: string, _id: string, role: string) {
    try {
      // Создание accessToken
      const accessToken = this.jwtService.sign(
        { email, _id, role },
        {
          secret: this.configService.get('PRIVATE_KEY'),
          expiresIn: '30m',
        },
      )

      // Создание refreshToken
      const refreshToken = this.jwtService.sign(
        { email, _id, role },
        {
          secret: this.configService.get('PRIVATE_KEY'),
          expiresIn: '24h',
        },
      )

      return {
        accessToken,
        refreshToken,
      }
    }
    catch (e) {
      console.log(e)
    }
  }

  // Получение пользователей/пользователя
  async getUsers(email: string) {
    let users
    if (email) {
      users = await this.userModel.find({  email: { $regex: `^${email}`, $options: 'i' } })
    }
    else {
      users = await this.userModel.find()
    }
    return users.map(u => {
      return {
        _id: u._id,
        email: u.email,
        role: u.role,
        banned: u.banned,
        banReason: u.banReason
      }
    })
  }

  async getUserById(_id: string) {
    const user = await this.userModel.findOne({ _id })
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    return {
      _id: user._id,
      email: user.email,
      role: user.role,
      banned: user.banned,
      banReason: user.banReason
    }
  }

  logout(res: Response) {
    res.clearCookie('accessToken')
    throw new HttpException('User logout', HttpStatus.OK )
  }

  async deleteUser(_id: string) {
    const deleteUserResult = await this.userModel.deleteOne({ _id })
    console.log(deleteUserResult.deletedCount)
    if (deleteUserResult.deletedCount !== 1) throw new BadRequestException('User not delete')

    throw new HttpException('User delete', HttpStatus.NO_CONTENT)
  }
}
