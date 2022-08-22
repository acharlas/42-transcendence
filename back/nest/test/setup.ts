import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

export default async () => {
  console.log('\n\n==>Setting up<==');
  let app: INestApplication;
  let prisma: PrismaService;
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  app = moduleRef.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.init();
  await app.listen(3334);
  globalThis.__app__ = app;

  prisma = app.get(PrismaService);
  globalThis.__prisma__ = prisma;
  await prisma.cleanDb();
};
