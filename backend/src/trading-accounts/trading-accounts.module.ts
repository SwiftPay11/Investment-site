import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TradingAccount } from "./trading-account.entity";
import { TradingAccountsService } from "./trading-accounts.service";
import { TradingAccountsController } from "./trading-accounts.controller";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([TradingAccount]), UsersModule],
  controllers: [TradingAccountsController],
  providers: [TradingAccountsService],
  exports: [TradingAccountsService],
})
export class TradingAccountsModule {}
