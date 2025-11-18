import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { Transaction } from '../transactions/transaction.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async getDashboardInfo(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['transactions'],
    });

    if (!user) return null;

    // use createdAt if your transaction has that field instead of date
    const transactions = await this.transactionRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
    });

    return {
      id: user.id,
      email: user.email,
      balance: Number(user.balance),
      transactions,
    };
  }
}
