import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import helmet from 'helmet'
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session';


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
      defaultSrc: ["'self'", "http:localhost:3000"],
      scriptSrc: ["'self'", "'unsafe-inline'", "http:localhost:3000"],
      styleSrc: ["'self'", "'unsafe-inline'", "http:localhost:3000"],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', "http:localhost:3000"],
      imgSrc: ["'self'", "http:localhost:3000"],
    },
  };

  app.use(helmet())
  app.use(helmet.contentSecurityPolicy(cspConfig))
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
  app.useGlobalPipes(new ValidationPipe())

  app.use(cookieParser())
  app.use(
    session({
      secret: ['secretKey'],
      cookie: {
        secret: 'secretKey',
        sameSite: 'strict',
        secure: true,
        httpOnly: false,
        maxAge: 24 * 60,
      },
    })
  );

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/api/docs', app, document)

  await app.listen(port, () => console.log(`server started on port ${port}`))
}

bootstrap()
