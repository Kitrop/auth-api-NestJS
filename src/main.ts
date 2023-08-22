import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import helmet from 'helmet'
import * as cookieParser from 'cookie-parser'


async function bootstrap() {
  const port = process.env.PORT || 3000

  const config = new DocumentBuilder()
    .setTitle('NestJS auth api')
    .setDescription('auth api')
    .setVersion('0.1')
    .addTag('AuthApi')
    .build()
  const app = await NestFactory.create(AppModule)

  const cspConfig = {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'"],
    },
  };

  app.use(helmet())
  app.use(helmet.contentSecurityPolicy(cspConfig))
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())

  app.use(cookieParser())

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/api/docs', app, document)

  await app.listen(port, () => console.log(`server started on port ${port}`))
}

bootstrap()
