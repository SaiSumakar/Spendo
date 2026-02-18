import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisModule as IORedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    IORedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'single',
        url: config.getOrThrow<string>('REDIS_URL') || 'redis://localhost:6379',
        options: {
          retryStrategy: (times: number) => Math.min(times * 50, 2000),
          maxRetriesPerRequest: 5,
        },
      }),
    }),
  ],
  exports: [IORedisModule],
})
export class RedisModule {}
