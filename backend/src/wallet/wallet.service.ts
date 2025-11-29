import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { Transaction } from '../transactions/transaction.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';
import { DepositGiftcardDto } from './dto/deposit-giftcard.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class WalletService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Transaction) private txRepo: Repository<Transaction>,
    private notificationsService: NotificationsService,
    private usersService: UsersService,
    private cloudinaryService: CloudinaryService,
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
         `
    <html>
      <body style="font-family:Arial, sans-serif;background:#f4f6f9;color:#333;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:auto;background:#fff;border:1px solid #e0e0e0;">
          <tr>
            <td style="background:#0d243a;padding:20px;text-align:center;color:#fff;font-size:24px;">
              NexTrade
            </td>
          </tr>
          <tr>
            <td style="padding:30px;">
              <h2 style="margin:0 0 10px;font-size:20px;color:#0d243a;">Payment Reversed</h2>
              <p style="font-size:14px;line-height:1.6;">
                Dear <strong>${user.fullname || 'User'}</strong>,<br/><br/>
                A previous transaction has been <strong>reversed</strong> and the amount 
                <span style="color:#009900;font-size:18px;">$${amount}</span> 
                has been <strong>credited back</strong> to your account.
              </p>

              <table width="100%" cellpadding="5" cellspacing="0" style="margin:20px 0;border:1px solid #e0e0e0;">
                <tr style="background:#f4f4f4;">
                  <td style="font-size:14px;">Reversal Amount:</td>
                  <td style="font-size:14px;"><strong>$${amount}</strong></td>
                </tr>
                <tr>
                  <td style="font-size:14px;">New Balance:</td>
                  <td style="font-size:14px;"><strong>$${Number(user.balance || 0).toFixed(2)}</strong></td>
                </tr>
              </table>

              <p style="font-size:12px;color:#666;">
                If you have any questions regarding this transaction, please contact NexTrade Support.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f4f6f9;padding:15px;text-align:center;font-size:12px;color:#999;">
              © ${new Date().getFullYear()} NexTrade. All rights reserved.<br/>
              This is an automated email — please do not reply.
            </td>
          </tr>
        </table>
      </body>
    </html>
    `
      );
    }, 7 * 60 * 1000); // 8 minutes

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

  async fundTrading(userId: number, amount: number) {
  if (amount <= 0) throw new BadRequestException("Amount must be positive");

  return this.dataSource.transaction(async (manager) => {
    const user = await manager.findOne(User, {
      where: { id: userId },
      relations: ["tradingAccounts"],
    });

    if (!user) throw new NotFoundException("User not found");

    const tradingAccount = user.tradingAccounts?.[0];
    if (!tradingAccount) throw new NotFoundException("Trading account not found");

    if (Number(user.balance) < amount)
      throw new BadRequestException("Insufficient main balance");

    // 1. Deduct main balance
    user.balance = Number(user.balance) - Number(amount);
    await manager.save(user);

    // 2. Increase trading account balance
    tradingAccount.accountBalance =
      Number(tradingAccount.accountBalance) + Number(amount);
    await manager.save(tradingAccount);

    // 3. Log transaction
    const tx = manager.create(Transaction, {
      user,
      type: "internal_transfer",
      amount: amount.toString(),
      currency: "USD",
      metadata: { from: "main", to: "trading", hedgingNumber: tradingAccount.hedgingNumber },
    });

    await manager.save(tx);

    // 4. Notify user
    await this.notificationsService.create(
      user,
      "Trading Account Funded",
      `\$${amount} has been moved from main to trading.`
    );

    return { user, tradingAccount, transaction: tx };
  });
}

async depositGiftcard(dto: DepositGiftcardDto, file: any) {
  if (!file) throw new BadRequestException("Giftcard image is required");

  // ⭐ FIX — send full file object (buffer), not file.path
  const imageUrl = await this.cloudinaryService.uploadImage(file);

  return this.dataSource.transaction(async (manager) => {
    const user = await manager.findOne(User, { where: { id: dto.userId } });
    if (!user) throw new NotFoundException("User not found");

    // DO NOT CREDIT USER — pending review
    const tx = manager.create(Transaction, {
      user,
      type: "deposit_giftcard",
      amount: dto.amount.toString(),
      currency: "USD",
      status: "pending",
      metadata: {
        cardType: dto.cardType,
        note: dto.note,
        image: imageUrl,
      },
    });

    await manager.save(tx);

    await this.notificationsService.create(
      user,
      "Giftcard Submitted",
      `Your ${dto.cardType} giftcard has been submitted and is pending review.`
    );

    return { transaction: tx };
  });
}

  async getPendingGiftcards() {
  return this.txRepo.find({
    where: { type: 'deposit_giftcard', status: 'pending' },
    relations: ['user'],
    order: { createdAt: 'DESC' },
    });
  }

  async approveGiftcard(id: number) {
  return this.dataSource.transaction(async manager => {
    const tx = await manager.findOne(Transaction, { where: { id }, relations: ["user"] });
    if (!tx) throw new NotFoundException("Transaction not found");

    if (tx.status !== "pending")
      throw new BadRequestException("Already processed");

    // Credit user NOW
    tx.user.balance = Number(tx.user.balance) + Number(tx.amount);
    await manager.save(tx.user);

    tx.status = "approved";
    await manager.save(tx);

    await this.notificationsService.create(
      tx.user,
      "Giftcard Approved",
      `Your giftcard deposit of $${tx.amount} has been approved and credited.`
    );

    return { success: true };
  });
  }

  async rejectGiftcard(id: number) {
  const tx = await this.txRepo.findOne({ where: { id }, relations: ["user"] });
  if (!tx) throw new NotFoundException("Transaction not found");

  if (tx.status !== "pending")
    throw new BadRequestException("Already processed");

  tx.status = "rejected";
  await this.txRepo.save(tx);

  await this.notificationsService.create(
    tx.user,
    "Giftcard Rejected",
    "Your giftcard was rejected. Please upload a clearer image or try another card."
  );

  return { success: true };
  }
}
