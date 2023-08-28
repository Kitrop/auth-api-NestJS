import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { RolesModule } from './roles/roles.module'
import { MongooseModule } from '@nestjs/mongoose'
import { TokenModule } from './token/token.module';
import { AppController } from './app.controller'


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URL),
    AuthModule,
    RolesModule,
    ConfigModule,
    TokenModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
