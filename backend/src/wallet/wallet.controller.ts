import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';
import { FundTradingDto } from './dto/fund-trading.dto';  // ⭐ ADD THIS


@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('deposit')
  async deposit(@Body() dto: DepositDto) {
    const res = await this.walletService.deposit(dto.userId, dto.amount, dto.currency, dto.source);
    return { success: true, data: res };
  }

  @Post('withdraw')
  async withdraw(@Body() dto: WithdrawDto) {
    const res = await this.walletService.withdraw(
      dto.userId,
      dto.amount,
      dto.destination || "destination",
    );
    return { success: true, data: res };
  }

  @Post('transfer')
  async transfer(@Body() dto: TransferDto) {
    const res = await this.walletService.transfer(dto.fromUserId, { email: dto.toUserEmail, accountNumber: dto.toAccountNumber }, dto.amount, dto.note);
    return { success: true, data: res };
  }

  @Post("fund-trading")
  async fundTrading(@Body() dto: FundTradingDto) {
    const res = await this.walletService.fundTrading(dto.userId, dto.amount);
    return { success: true, data: res };
  }

  @Get('transactions/:userId')
  async transactions(@Param('userId') userId: number) {
    const res = await this.walletService.transactions(Number(userId));
    return { success: true, data: res };
  }
}
