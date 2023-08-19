import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RolesService } from './roles.service'
import { CreateRoleDto, GetRoleDto } from '../dto/role.dto'

@ApiTags('Roles')
@Controller('role')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'Создание роли' })
  @ApiResponse({ status: 201, type: CreateRoleDto })
  @Post('create')
  async createRole(@Body() value: CreateRoleDto) {
    const response = await this.rolesService.createRole(value)
    return response
  }

  @Post('update')
  async getRole(@Body() getRoleDto: GetRoleDto) {
    const response = await this.rolesService.getRole(getRoleDto.value.toUpperCase(), getRoleDto.email)
    return response
  }
}