import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/users.entity';
import { Transaction } from './transactions/transaction.entity';
import { DashboardModule } from './dashboard/dashboard.module';
import { WalletModule } from './wallet/wallet.module';
import { InvestModule } from './invest/invest.module';
import { Notification } from './notifications/notifications.entity';
import { NotificationsModule } from './notifications/notifications.module';
import { TradingAccountsModule } from './trading-accounts/trading-accounts.module';
import { TradingAccount } from './trading-accounts/trading-account.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // Render DB
      entities: [User, Transaction, Notification, TradingAccount],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false, // VERY IMPORTANT for Render
      },
    }),

    AuthModule,
    UsersModule,
    DashboardModule,
    WalletModule,
    InvestModule,
    NotificationsModule,
    TradingAccountsModule,
  ],
})
export class AppModule {}
