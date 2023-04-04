import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './shared/config/validationEnv';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env', //or import from args
      isGlobal: true,
      validate: validate,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
