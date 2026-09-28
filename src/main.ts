import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as fs from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  const candidatePaths = [
    join(process.cwd(), 'public'),
    join(__dirname, '..', 'public'),
    join(__dirname, '..', '..', 'public'),
  ];
  const publicPath = candidatePaths.find((p) => fs.existsSync(p));
  if (publicPath) {
    app.useStaticAssets(publicPath);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap().catch((error: unknown) => {
  console.error('Application failed to start:', error);
  process.exitCode = 1;
});
