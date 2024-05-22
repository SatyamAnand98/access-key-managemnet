import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigModule } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as csurf from 'csurf';
import helmet from 'helmet';

ConfigModule.forRoot({
  envFilePath: ['.development.env'],
});

/**
 * Creates a NestJs server
 * @returns void
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // app.use(csurf()); // Cross-site request forgery (also known as CSRF or XSRF) is a type of malicious exploit of a website where unauthorized commands are transmitted from a user that the web application trusts. To mitigate this kind of attack you can use the csurf package.
  // app.use(helmet());

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
