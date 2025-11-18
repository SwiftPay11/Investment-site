import {
  Controller,
  Post,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Get } from '@nestjs/common'; // make sure it's imported

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('all')
  async getAllUsers() {
    return await this.usersService.findAll();
  }

  @Get('me-by-email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Get('me/:id')
  async getMe(@Param('id') id: number) {
    return this.usersService.findById(Number(id));
  }

  // user.controller.ts
  @Post("create-mt5/:id")
  async createMT5(@Param("id") id: string) {
    return this.usersService.createMT5Account(id);
  }

  // ✅ Regular create user route (untouched)
  @Post('create')
  async create(@Body() body: any) {
    try {
      return await this.usersService.create(body);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

 @Post('transfer')
async transfer(
  @Body()
  body: {
    senderId: number;
    recipientAccount: string;
    amount: number;
  },
) {
  const { senderId, recipientAccount, amount } = body;

  if (!senderId || !recipientAccount || !amount) {
    throw new BadRequestException('Missing required fields');
  }

  // Verify sender exists
  const sender = await this.usersService.findById(senderId);
  if (!sender) throw new BadRequestException('Invalid sender');

  // 🔥 FIX IS HERE — ensure 3 arguments
  const result = await this.usersService.transferFunds(
    sender.id,
    recipientAccount,
    amount
  );

    return result;
  }

  // ✅ Admin-triggered reversal endpoint
  @Post('admin/reverse-payment')
  async reversePayment(@Body() body: { adminEmail: string; adminPassword: string; userId: number; amount: number }) {
    // ✅ Simple static admin credentials
    const ADMIN_EMAIL = 'admin@nexttrade.com';
    const ADMIN_PASS = 'nexttrade123';

    if (body.adminEmail !== ADMIN_EMAIL || body.adminPassword !== ADMIN_PASS) {
      throw new BadRequestException('Unauthorized admin credentials');
    }

    if (!body.userId || !body.amount) {
      throw new BadRequestException('Missing userId or amount');
    }

    try {
      const result = await this.usersService.reversePayment(body.userId, body.amount);
      return result;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
