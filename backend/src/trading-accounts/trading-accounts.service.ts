import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TradingAccount } from "./trading-account.entity";
import { UsersService } from "../users/users.service";

@Injectable()
export class TradingAccountsService {
  constructor(
    @InjectRepository(TradingAccount)
    private repo: Repository<TradingAccount>,
    private usersService: UsersService,
  ) {}

  generateHedgingNumber() {
    const random = Math.floor(100000000 + Math.random() * 900000000);
    return `MT5-${random}-HDG`;
  }

  async createAccount(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    const account = this.repo.create({
      user,
      hedgingNumber: this.generateHedgingNumber(),
      accountBalance: 0,
      freeMargin: 0,
      leverage: "1:500",
      activated: false,
    });

    return await this.repo.save(account);
  }

  async getAccounts(userId: number) {
    return this.repo.find({
      where: { user: { id: userId } },
      order: { id: "DESC" },
    });
  }

  async activateAccount(accountId: number) {
    const acc = await this.repo.findOne({ where: { id: accountId } });
    if (!acc) throw new NotFoundException("Account not found");

    acc.activated = true;
    return this.repo.save(acc);
  }
}
