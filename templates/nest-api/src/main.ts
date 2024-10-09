import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { setupSwagger } from './swagger';
import { defaultVersions } from '@msa/helpers';
import { API_PREFIX } from '@msa/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: defaultVersions(),
  });

  if (process.env.STAGE !== 'prod01') {
    setupSwagger(app);
  }

  app.setGlobalPrefix(API_PREFIX);

  await app.listen(3000);
}
bootstrap();
