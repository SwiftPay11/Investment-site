import { Module } from '@nestjs/common';
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
import { TradingAccountsModule } from "./trading-accounts/trading-accounts.module";
import { TradingAccount } from './trading-accounts/trading-account.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      // Use Render DATABASE_URL in production, fall back to local in dev
      url:
        process.env.DATABASE_URL ||
        'postgres://postgres:erimogar@localhost:5432/swiftchat',
      entities: [User, Transaction, Notification, TradingAccount],
      synchronize: true, // ok for dev, later we can switch to migrations
      ssl: process.env.DATABASE_URL
       ? { rejectUnauthorized: false }
      : false,
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
