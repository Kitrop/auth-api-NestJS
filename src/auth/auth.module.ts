import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from '../schemas/user.schema'
import { AuthController } from './auth.controller';

console.log(process.env.DB_URL)
@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://veryyoshicool:2oJOUiiYj3xYNJXW@cluster0.qz3ho2g.mongodb.net/?retryWrites=true&w=majority'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
