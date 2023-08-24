import { BadRequestException, CanActivate, ExecutionContext } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'


// Guard который проверяет то что пользователь не залогинен
export class UnAuthorizeGuard implements CanActivate {
  constructor() {
  }

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest() // Получаем объект http запроса

    let accessToken = req.cookies.accessToken // Достаем из запроса куки accessToken

    if (accessToken) {
      throw new BadRequestException('User is already logged in')
    }
    return true
  }
}