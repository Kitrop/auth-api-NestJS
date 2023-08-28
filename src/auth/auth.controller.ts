import { Body, Controller, Get, HttpStatus, Post, Query, Res, UseGuards } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { DeleteUserDto, LoginUserDto, RegistrationUserError, UserDto } from '../dto/user.dto'
import { AuthService } from './auth.service'
import { Request, Response } from 'express'
import { JwtAuthGuard } from './jwt-auth.guard'
import { UnAuthorizeGuard } from './unAuthorize.guard'
import { RolesGuard } from '../roles/roles.guard'
import { Roles } from '../roles/roles.decorator'

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserDto, description: 'User success created'})
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: RegistrationUserError,description: 'User not created'})
  @ApiBody({ required: true, description: 'Body required value'})
  @ApiParam({ name: "user", example: { email: 'user@gmail.com', password: '12345' }, required: true })
  @UseGuards(UnAuthorizeGuard)
  @Post('registration')
  createUser(@Body() user: UserDto) {
    return this.authService.createUser(user)
  }

  @UseGuards(UnAuthorizeGuard)
  @Post('login')
  loginUser(@Res({ passthrough: true }) res: Response, @Body() loginUser: LoginUserDto) {
    return this.authService.loginUser(res, loginUser)
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logoutUser(@Res() res: Response) {
    return this.authService.logout(res)
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post('delete')
  deleteUser(@Body() deleteUser: DeleteUserDto) {
    return this.authService.deleteUser(deleteUser._id)
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  getUsers(@Query('email') email: string) {
    return this.authService.getUsers(email)
  }
  @UseGuards(JwtAuthGuard)
  @Get('user')
  getUsersById(@Body('_id') _id: string) {
    return this.authService.getUserById(_id)
  }


}
