import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { TokenService } from '../token/token.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {
  }

  // Guard для проверки jwt токена
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest() // Получаем объект http запроса

    let accessToken = req.cookies.accessToken // Достаем из запроса куки accessToken
    if (!accessToken) throw new UnauthorizedException('User is not loggin')

    // Расшифровываем полученный токен, доставая из него время
    const decodedAccessToken = this.jwtService.decode(accessToken) as { exp: number }
    if (!decodedAccessToken || !decodedAccessToken.exp) { // Если токен не валидный
      throw new UnauthorizedException('Invalid token')
    }

    const currentTime = Math.floor(Date.now() / 1000) // Получаем текущее время
    if (decodedAccessToken.exp < currentTime) { // Если токен истек по времени(текущее время больше чем жизнь токена)
      const findRefreshToken = await this.tokenService.findTokenByAccess(accessToken) // Находим refreshToken по accessToken
      if (!findRefreshToken) throw new UnauthorizedException('Invalid token')
      accessToken = await this.tokenService.generateAccessToken(findRefreshToken) // обновляем accessToken на новый
    }

    // Верифицируем новый токен и получаем из него информацию
    const user = this.jwtService.verify(accessToken, { secret: this.configService.get('PRIVATE_KEY') })
    req.user = user
    return true

    return false
  }
}
