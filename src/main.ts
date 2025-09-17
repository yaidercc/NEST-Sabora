import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("Boostrap");

  app.use('/api/invoice/webhook', bodyParser.raw({ type: 'application/json' }));

  app.setGlobalPrefix("api")
  app.useGlobalPipes(
    new ValidationPipe(
      {
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        skipMissingProperties: true
      }
    )
  )

  const config = new DocumentBuilder()
    .setTitle('Sabora API')
    .setDescription('All the sabora endpoints')
    .setVersion('1.0')
    .addBearerAuth({
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      name: "Authorization",
      in: "header"
    },
      "access-token"
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  logger.log(`Server started on the port ${process.env.PORT}`)
}
bootstrap();
