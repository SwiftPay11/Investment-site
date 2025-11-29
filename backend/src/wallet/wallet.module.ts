import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { User } from '../users/users.entity';
import { UsersModule } from '../users/users.module';
import { Transaction } from '../transactions/transaction.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Transaction]), // ✅ ONLY ENTITIES HERE
    UsersModule,
    NotificationsModule,
    CloudinaryModule, // ✅ MODULES GO OUTSIDE
  ],
  controllers: [WalletController],
  providers: [WalletService, CloudinaryService],
  exports: [WalletService],
})
export class WalletModule {}
