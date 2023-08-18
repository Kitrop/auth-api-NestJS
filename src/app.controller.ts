import { Body, Controller, Get, Post } from '@nestjs/common'
import { AppService } from './app.service'
import { AuthService } from './auth/auth.service'
import { GetUsersDto, UserDto } from './dto/user.dto'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Users')
@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({ status: 201, type: UserDto })
  @Post('registration')
  async createUser(@Body() user: UserDto) {
    const response = await this.authService.createUser(user)
    return response
  }

  @ApiOperation({ summary: 'Получение пользователей' })
  @ApiResponse({ status: 200, type: GetUsersDto, isArray: true })
  @Get('users')
  async getUsers() {
    const response = await this.authService.getUsers()
    return response
  }
}
