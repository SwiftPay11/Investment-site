import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestController } from './invest.controller';
import { InvestService } from './invest.service';
import { User } from '../users/users.entity';
import { Transaction } from '../transactions/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Transaction])],
  controllers: [InvestController],
  providers: [InvestService],
})
export class InvestModule {}
