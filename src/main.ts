import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Set up Swagger
  const config = new DocumentBuilder()
    .setTitle('FIXIT')
    .setDescription('API documentation for FIXIT')
    .setVersion('1.0')
    .addTag('Endpoints')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
await app.listen(port);

}
bootstrap();
