import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: Number(configService.get('DB_PORT', 3006)),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', '123'),
        database: configService.get('DB_DATABASE', 'parking'),
        autoLoadEntities: true,
        synchronize:
          configService.get('NODE_ENV', 'development') !== 'production',
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ConfigModule],
  exports: [ConfigModule],
})
export class DatabaseModule {}
