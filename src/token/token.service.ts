import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Token, TokenDocument } from '../schemas/token.schema'
import { TokensDto } from '../dto/token.dto'
import { NotFoundError } from 'rxjs'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Сохранение токена в БД
  async saveToken(_id: string, tokens: TokensDto) {
    // Находим токены по айди
    const findTokens = await this.tokenModel.findOne({ _id })
    // Если нет записей по айди, создаем новую запись с токенами
    if (!findTokens) {
      const newTokens = await this.tokenModel.create({
        _id,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      })
      if (!newTokens) throw new BadRequestException('Unexpected error') // Если произошла ошибка во время создания

      return newTokens
    }

    // Если есть записи в БД, то обновляем токены
    findTokens.accessToken = tokens.accessToken
    findTokens.refreshToken = tokens.refreshToken

    findTokens.save() // Сохраняем обновленные токены в БД

    return findTokens

  }

  // Нахождение токенов по accessToken
  async findTokenByAccess(accessToken: string) {
    const findTokens = await this.tokenModel.findOne({ accessToken })
    if (!findTokens) return false
    return findTokens.refreshToken
  }

  // Генерация accessToken с помощью refreshToken
  async generateAccessToken(refreshToken: string) {
    // Нахождение токенов по refreshToken
    const tokens = await this.tokenModel.findOne({ refreshToken })

    // Верифицируем refreshToken, если все прошло успешно получаем данные из refreshToken
    const verifyRefreshToken = await this.jwtService.verify(
      tokens.refreshToken,
      {
        secret: this.configService.get('PRIVATE_KEY'),
      }
    )

    // Если произошла ошибка при верификации refreshToken
    if (!verifyRefreshToken) throw new BadRequestException('No token')

    // Создание accessToken
    const accessToken = this.jwtService.sign({ email: verifyRefreshToken.email, _id: verifyRefreshToken._id, role: verifyRefreshToken.role }, {
      secret: this.configService.get('PRIVATE_KEY'),
      expiresIn: '40m'
    })

    return accessToken
  }
}
