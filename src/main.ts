import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigModule } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as csurf from 'csurf';
import helmet from 'helmet';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth/auth.guard';
import { Logger } from '@nestjs/common';
import { AllExceptionsFilter } from './store/middlewares/http-exception.filter';

ConfigModule.forRoot({
  envFilePath: ['.development.env'],
});

/**
 * Creates a NestJs server
 * Bootstraps the application.
 *
 * @returns {Promise<void>} A promise that resolves when the application is successfully bootstrapped.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { cors: true });
  const logger = new Logger('token-info');
  const reflector = app.get(Reflector);
  const jwtService = app.get(JwtService);

  /**
   * using AuthGuard to authenticate each request in useGlobalGuards
   */
  app.useGlobalGuards(new AuthGuard(jwtService, reflector));
  /**
   * using AllExceptionsFilter to handle all exceptions
   */
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  /**
   * Logging all unhandled rejection
   */
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  /**
   * Logging all uncaught exception
   */
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
  });

  // app.use(csurf()); // Cross-site request forgery (also known as CSRF or XSRF) is a type of malicious exploit of a website where unauthorized commands are transmitted from a user that the web application trusts. To mitigate this kind of attack you can use the csurf package.
  app.use(helmet());

  /**
   * Creates Swagger for the services with below details:
   * -  Title
   * -  Description
   * -  Versioning
   * -  Tag
   */
  const config = new DocumentBuilder()
    .setTitle('Key Management Service')
    .setDescription('Key Management Service API Server')
    .setVersion('1.0')
    .addTag('Key Managements')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app
    .listen(process.env.PORT)
    .then(() =>
      console.log(`Application started at port number: ${process.env.PORT}`),
    );
}
bootstrap();
