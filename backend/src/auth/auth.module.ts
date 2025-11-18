import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsModule } from '../notifications/notifications.module';
import { User } from '../users/users.entity'; // ⭐ ADD THIS

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // ⭐ REQUIRED FIX
    UsersModule,
    NotificationsModule,
    JwtModule.register({
      secret: 'cryptofx-secret', // change to env later
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
