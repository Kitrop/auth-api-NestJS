import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GetUsersDto, LoginUserDto, UserDto } from '../dto/user.dto'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './jwt-auth.guard'
import { Roles } from '../roles/roles.decorator'
import { RolesGuard } from '../roles/roles.guard'

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    ) {}

  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({ status: 201, type: UserDto })
  @Post('registration')
  createUser(@Body() user: UserDto) {
    return this.authService.createUser(user)
  }

  @Roles("ADMIN")
  @UseGuards(RolesGuard)

  @Get('users')
  getUsers() {
    return this.authService.getUsers()
  }

  @Post('login')
  loginUser(@Body() loginUser: LoginUserDto) {
    return this.authService.loginUser(loginUser)
  }
}
