import { Injectable } from '@nestjs/common';
import { GenerateTokenDto } from '../dto/token.dto'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}
  async generateToken(user: GenerateTokenDto) {
    const payload = {email: user.email, _id: user._id, role: user.role}
    return {
      token: this.jwtService.sign(payload)
    }
  }
}
