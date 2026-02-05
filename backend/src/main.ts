import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const dataSource = app.get(DataSource);

  try {
    await dataSource.query('SELECT 1');
    console.log('Database connection OK');
  } catch (err) {
    console.error('Database connection FAILED', err);
  }


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
