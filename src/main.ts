import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 5002;
  const logger = new Logger('Bootstrap');

  // Swagger setup
  // Swagger setup

  const config = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription('Dokumentasi API Blog')
    .setVersion('1.0')
    .addServer('/api/v1') // tambahkan ini
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // MongoDB Connection Logging
  mongoose.connection.on('connected', () => {
    logger.log('✅ Terhubung ke MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    logger.error(`❌ Gagal terhubung ke MongoDB: ${err}`);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('⚠️ Koneksi ke MongoDB terputus');
  });

  app.setGlobalPrefix('api/v1');

  await app.listen(port);
  logger.log(`🚀 Server berjalan di http://localhost:${port}`);
}

bootstrap();
