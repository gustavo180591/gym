import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ConfigModule, JwtModule, TypeOrmModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, ConfigService],
  exports: [AuthService]
})
export class AuthModule {}
