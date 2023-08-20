import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtAuthGuard } from './jwt-auth.guard'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [JwtModule.register({
    secret: 'secretKey',
    signOptions: {
      expiresIn: '24h',
    },
  })],
  providers: [TokenService, JwtAuthGuard],
  exports: [TokenService, JwtAuthGuard]
})
export class TokenModule {}
