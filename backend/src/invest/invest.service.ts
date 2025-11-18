import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../users/users.entity';
import { Transaction } from '../transactions/transaction.entity';

@Injectable()
export class InvestService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Transaction) private txRepo: Repository<Transaction>,
  ) {}

  getPlans() {
    // static plans for now
    return [
      { id: 'plan_basic', name: 'Starter', apy: 5, min: 10, description: 'Low risk short-term' },
      { id: 'plan_growth', name: 'Growth', apy: 12, min: 100, description: 'Medium risk 3 months' },
      { id: 'plan_pro', name: 'Pro', apy: 20, min: 1000, description: 'High yield 6-12 months' },
    ];
  }

  async startInvestment(userId: number, planId: string, amount: number) {
    if (!amount || amount <= 0) throw new BadRequestException('Amount must be positive');

    const plans = this.getPlans();
    const plan = plans.find((p) => p.id === planId);
    if (!plan) throw new BadRequestException('Invalid plan');

    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      if (Number(user.balance ?? 0) < amount) throw new BadRequestException('Insufficient funds');

      // debit user balance
      user.balance = Number(user.balance) - Number(amount);
      await manager.save(user);

      // create a transaction record
      const tx = manager.create(Transaction, {
        user,
        type: 'invest_start',
        amount: String(amount),
        currency: 'USD',
        metadata: { planId, apy: plan.apy },
      });
      await manager.save(tx);

      // for now we don't create separate Investment entity; you can add one later
      return { user, transaction: tx, plan };
    });
  }
}
