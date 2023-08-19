import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { JwtService } from '@nestjs/jwt'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '../roles/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest()
    const authHeader = req.headers.authorization

    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [context.getHandler(), context.getClass])
    if (!requiredRoles) {
      return true
    }

    const token = authHeader.split(' ')[1]
    const bearer = authHeader.split(' ')[0]

    if (bearer !== 'Bearer' || !token) {
      throw new BadRequestException('Invalid token')
    }
    const user = this.jwtService.verify(token)
    req.user = user
    console.log(user.role)
    console.log(requiredRoles)
    return requiredRoles.includes(user.role)
  }

}