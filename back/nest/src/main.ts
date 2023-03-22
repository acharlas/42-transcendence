import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { SokcetIOAdapter } from './socket-io-adapter';
import { writeFileSync, readFileSync } from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/cossetheo.com/fullchain.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/cossetheo.com/privkey.pem'),
  };
  const app = await NestFactory.create(AppModule, {httpsOptions});
  const configService = app.get(ConfigService);
  const prisma = app.get(PrismaService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Nestjs back')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors({
    origin: '*', //http://5.182.18.157:3001
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  app.useWebSocketAdapter(new SokcetIOAdapter(app, configService, prisma));
  await app.listen(443);
}
bootstrap();
