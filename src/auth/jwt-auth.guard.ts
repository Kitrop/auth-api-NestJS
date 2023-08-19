import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest()
    const authHeader = req.headers.authorization
    console.log(authHeader)
    const token = authHeader.split(' ')[1]
    const bearer = authHeader.split(' ')[0]

    if (bearer !== 'Bearer' || !token) {
      throw new BadRequestException('Invalid token')
    }
    const user = this.jwtService.verify(token)
    req.user = user
    return true
  }

}