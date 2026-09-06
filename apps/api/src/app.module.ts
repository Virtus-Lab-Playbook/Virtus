import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseService } from './database.service';
import { HealthController } from './health.controller';
import { OperationsController } from './operations.controller';
import { OperationsService } from './operations.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [HealthController, AuthController, OperationsController],
  providers: [DatabaseService, AuthService, OperationsService],
  exports: [DatabaseService, AuthService],
})
export class AppModule {}
