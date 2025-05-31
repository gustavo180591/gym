import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MembershipsModule } from './memberships/memberships.module';
import { ClassesModule } from './classes/classes.module';
import { BookingsModule } from './bookings/bookings.module';
import { RoutinesModule } from './routines/routines.module';
import { ProgressModule } from './progress/progress.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    UsersModule,
    MembershipsModule,
    ClassesModule,
    BookingsModule,
    RoutinesModule,
    ProgressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
