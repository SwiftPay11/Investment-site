import { Controller, Post, Param, Get } from "@nestjs/common";
import { TradingAccountsService } from "./trading-accounts.service";

@Controller("trading-accounts")
export class TradingAccountsController {
  constructor(private service: TradingAccountsService) {}

  @Post("create/:userId")
  async create(@Param("userId") userId: number) {
    return this.service.createAccount(Number(userId));
  }

  @Get("user/:userId")
  async getAll(@Param("userId") userId: number) {
    return this.service.getAccounts(Number(userId));
  }
}
