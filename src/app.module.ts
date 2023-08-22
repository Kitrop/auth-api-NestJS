import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { RolesModule } from './roles/roles.module'
import { MongooseModule } from '@nestjs/mongoose'
import { TokenModule } from './token/token.module';


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
