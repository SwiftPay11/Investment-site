import { Body, Controller, Get, Post } from '@nestjs/common';
import { InvestService } from './invest.service';
import { StartInvestDto } from './dto/start-invest.dto';

@Controller('invest')
export class InvestController {
  constructor(private readonly investService: InvestService) {}

  @Get('plans')
  getPlans() {
    return { success: true, data: this.investService.getPlans() };
  }

  @Post('start')
  async start(@Body() dto: StartInvestDto) {
    const res = await this.investService.startInvestment(dto.userId, dto.planId, dto.amount);
    return { success: true, data: res };
  }
}
