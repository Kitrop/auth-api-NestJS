import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { GetUsersDto, UserDto } from '../dto/user.dto'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
