import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// IMPORT UsersService so you can call createAdmin()
import { UsersService } from './users/users.service';

// Entities
import { User } from './users/users.entity';
import { Transaction } from './transactions/transaction.entity';
import { Notification } from './notifications/notifications.entity';
import { TradingAccount } from './trading-accounts/trading-account.entity';

// Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { WalletModule } from './wallet/wallet.module';
import { InvestModule } from './invest/invest.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TradingAccountsModule } from './trading-accounts/trading-accounts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Transaction, Notification, TradingAccount],
      synchronize: true,
      ssl: { rejectUnauthorized: false },
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
export class AppModule implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    console.log("🚀 Checking admin account...");
    await this.usersService.createAdmin();
  }
}
