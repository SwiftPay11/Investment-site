import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { Transaction } from '../transactions/transaction.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class WalletService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Transaction) private txRepo: Repository<Transaction>,
    private notificationsService: NotificationsService, // ✅ ADD THIS
    private usersService: UsersService, // ⭐ ADD THIS
  ) {}

  async deposit(userId: number, amount: number, currency = 'USD', source?: string) {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');

    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      user.balance = Number(user.balance ?? 0) + Number(amount);
      await manager.save(user);

      const tx = manager.create(Transaction, {
        user, // ✅ use user entity directly
        type: 'deposit',
        amount: amount.toString(), // ✅ convert number → string
        currency,
        metadata: { source },
      });
      await manager.save(Transaction, tx);
      await this.notificationsService.create(
        user,
        "Deposit Successful",
        `Your deposit of $${amount} was successful.`,
      );

      return { user, transaction: tx };
    });
  }

 async withdraw(userId: number, amount: number, destination: string) {
  if (amount <= 0) throw new BadRequestException("Amount must be positive");

  return this.dataSource.transaction(async (manager) => {
    const user = await manager.findOne(User, { where: { id: userId } });
    if (!user) throw new NotFoundException("User not found");

      if (Number(user.balance) < amount)
      throw new BadRequestException("Insufficient funds");

    // Debit user
      user.balance = Number(user.balance) - amount;
      await manager.save(user);

    // Create withdraw transaction
    const tx = manager.create(Transaction, {
      user,
      type: "withdraw",
      amount: amount.toString(),
      currency: "USD",
      metadata: { destination },
    });
    await manager.save(tx);

    // -------------------------------------------
    // SEND DEBIT ALERT (EMAIL + IN-APP)
    // -------------------------------------------
    await this.usersService.sendEmailAlert(
      user.email,
      "Debit Alert",
      `<h3>Your account was debited $${amount}</h3>`
    );

    await this.notificationsService.create(
      user,
      "Debit Alert",
      `$${amount} has been withdrawn to ${destination}`
    );

      // -------------------------------------------
      // AUTO REVERSE AFTER 8 MINUTES
      // -------------------------------------------
      setTimeout(async () => {
    user.balance = Number(user.balance) + amount;
      await this.usersRepo.save(user);

      await this.notificationsService.create(
        user,
        "Payment Reversed",
        `$${amount} has been reversed back to your account.`
      );

      await this.usersService.sendEmailAlert(
        user.email,
        "Payment Reversal",
        `<h3>Your earlier withdrawal of $${amount} has been reversed.</h3>`
      );
    }, 8 * 60 * 1000); // 8 minutes

      return { user, transaction: tx };
    });
  }

  async transfer(
    fromUserId: number,
    toIdentifier: { email?: string; accountNumber?: string },
    amount: number,
    note?: string,
  ) {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');

    return this.dataSource.transaction(async (manager) => {
      const from = await manager.findOne(User, { where: { id: fromUserId } });
      if (!from) throw new NotFoundException('Sender not found');

      let to: User | null = null;
      if (toIdentifier.email) {
        to = await manager.findOne(User, { where: { email: toIdentifier.email } });
      } else if (toIdentifier.accountNumber) {
        to = await manager.findOne(User, { where: { accountNumber: toIdentifier.accountNumber } });
      }
      if (!to) throw new NotFoundException('Recipient not found');

      if (Number(from.balance ?? 0) < amount)
        throw new BadRequestException('Insufficient funds');

      from.balance = Number(from.balance) - Number(amount);
      to.balance = Number(to.balance ?? 0) + Number(amount);

      await manager.save(from);
      await manager.save(to);
      // ⭐ Notify receiver
      await this.notificationsService.create(
        to,
      "Incoming Transfer",
        `You received $${amount} from ${from.fullname || from.email}.`,
      );

      // ⭐ Notify sender
      await this.notificationsService.create(
        from,
    "Transfer Sent",
        `You sent $${amount} to ${to.fullname || to.email}.`,
      );

      const txOut = manager.create(Transaction, {
        user: from,
        type: 'transfer_out',
        amount: amount.toString(),
        metadata: { to: to.id, note },
      });

      const txIn = manager.create(Transaction, {
        user: to,
        type: 'transfer_in',
        amount: amount.toString(),
        metadata: { from: from.id, note },
      });

      await manager.save(Transaction, [txOut, txIn]);

      return { from, to, txOut, txIn };
    });
  }

  async transactions(userId: number) {
    return this.txRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }
}
