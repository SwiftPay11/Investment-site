import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get(':email')
  async getDashboardData(@Param('email') email: string) {
    const userData = await this.dashboardService.getDashboardInfo(email);

    if (!userData) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return {
      success: true,
      message: 'Dashboard data fetched successfully',
      data: userData,
    };
  }
}
