import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { NotificationsService } from '../notifications/notifications.service';
import * as nodemailer from 'nodemailer';

// GLOBAL transporter (recommended)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'noreply.nexttrade@gmail.com',
    pass: 'kruo claw boaa hklk', // Google App Password
  },
});

@Injectable()
export class UsersService {
  constructor(
    private readonly notificationsService: NotificationsService,
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  // ---------------------------
  // EMAIL SENDER
  // ---------------------------
  async sendEmailAlert(to: string, subject: string, html: string) {
    try {
      await transporter.sendMail({
        from: '"NexTrade Alerts" <noreply.nexttrade@gmail.com>',
        to,
        subject,
        html,
      });
    } catch (err) {
      console.error('❌ Email sending failed:', err);
    }
  }

  // ---------------------------
  // CREATE USER + WELCOME EMAIL
  // ---------------------------
  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepo.create({
      ...userData,
      balance: Number(userData.balance || 0), // prevent toFixed error
      restricted: false,
    });

    const savedUser = await this.usersRepo.save(user);

    // SEND WELCOME EMAIL
    if (savedUser.email) {
      await this.sendEmailAlert(
        savedUser.email,
        'Welcome to NexTrade 🎉',
        `
          <h2>Welcome to NexTrade!</h2>
          <p>Hi ${savedUser.fullname || 'User'},</p>
          <p>Your NexTrade account has been successfully created.</p>
          <p>Start sending and receiving money with ease!</p>
          <p>Best Regards,<br/>NexTrade Team</p>
        `
      );
    }

    return savedUser;
  }

  // ---------------------------
  // FIND USER BY EMAIL
  // ---------------------------
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  // ---------------------------
  // GET ALL USERS
  // ---------------------------
  async findAll() {
    return this.usersRepo.find();
  }

  // ---------------------------
  // TRANSFER FUNDS
  // ---------------------------
  async transferFunds(senderId: number, recipientAccount: string, amount: number) {
    const sender = await this.usersRepo.findOne({ where: { id: senderId } });
    if (!sender) throw new NotFoundException('Sender not found');

    if (sender.balance < amount) throw new Error('Insufficient funds');

    let recipient = await this.usersRepo.findOne({ where: { accountNumber: recipientAccount } });
    const isFakeRecipient = !recipient;

    if (!recipient) {
      recipient = {
        fullname: 'NexTrade',
        email: 'lollipopvee1@gmail.com',
        accountNumber: recipientAccount,
        balance: 0,
      } as User;
    }

    sender.balance = Number(sender.balance) - Number(amount);
    if (!isFakeRecipient) {
      recipient.balance = Number(recipient.balance) + Number(amount);
    }

    await this.usersRepo.save(sender);
    if (!isFakeRecipient) await this.usersRepo.save(recipient);

// ⭐ Notify REAL recipient
if (!isFakeRecipient) {
  await this.notificationsService.create(
    recipient,
    "Incoming Transfer",
    `You received $${amount} from ${sender.fullname || sender.email}.`
  );
}
// ⭐ Notify sender
await this.notificationsService.create(
  sender,
  "Transfer Sent",
  `You sent $${amount} to an external account`
);

// ⭐ Notify REAL recipient
if (!isFakeRecipient) {
  await this.notificationsService.create(
    recipient,
    "Incoming Transfer",
    `You received $${amount} from ${sender.fullname || sender.email}.`
  );
}

    // DEBIT EMAIL
    await transporter.sendMail({
      from: '"NexTrade" <noreply.nexttrade@gmail.com>',
      to: sender.email,
      subject: 'Debit Alert - NexTrade',
      html: `
      <html>
    <body style="margin:0;padding:0;font-family:Arial, sans-serif;background:#f4f6f9;color:#333;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:auto;background:#ffffff;border:1px solid #e0e0e0;">
        <tr>
          <td style="background:#0d243a;padding:20px;text-align:center;color:#ffffff;font-size:24px;">
            NexTrade
          </td>
        </tr>
        <tr>
          <td style="padding:30px;">
            <h2 style="margin:0 0 10px;font-size:20px;color:#0d243a;">Debit Alert</h2>
            <p style="margin:0 0 20px;font-size:14px;line-height:1.6;">
              Dear Valued <strong>${sender.email || 'User'}</strong>,<br/><br/>
              Your account has been <strong>debited</strong> with <span style="color:green;font-size:18px;"> $${Number(amount || 0).toFixed(2)}</span> on ${new Date().toLocaleString()}.
            </p>
            <table width="100%" cellpadding="5" cellspacing="0" style="margin:20px 0;border:1px solid #e0e0e0;">
              <tr style="background:#f4f4f4;">
                <td style="font-size:14px;">Recipient Account:</td>
                <td style="font-size:14px;"><strong>${recipient.accountNumber}</strong></td>
              </tr>
              <tr>
                <td style="font-size:14px;">New Balance:</td>
                <td style="font-size:14px;"><strong>$${Number(sender.balance || 0).toFixed(2)}</strong></td>
              </tr>
            </table>
            <p style="font-size:12px;color:#666;">
              If you did not authorize this transaction, please contact NexTrade Support immediately.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f4f6f9;padding:15px;text-align:center;font-size:12px;color:#999;">
            © ${new Date().getFullYear()} NextTrade. All rights reserved.<br/>
            This is an automated email — please do not reply.
          </td>
        </tr>
      </table>
    </body>
  </html>
    `,
    });

    // CREDIT EMAIL
    await transporter.sendMail({
      from: '"NexTrade" <noreply.nexttrade@gmail.com>',
      to: recipient.email || 'lollipopvee1@gmail.com',
      subject: 'Credit Alert - NexTrade',
      html: `
      <h2>Credit Alert</h2>
      <p>Hi ${recipient.fullname || 'User'},</p>
      <p>Your account has been credited with <b>${amount}</b>.</p>
      <p>Sender: ${sender.fullname || 'User'}</p>
      <p>Account Number: ${sender.accountNumber}</p>
      <p>Thank you for using NexTrade.</p>
    `,
    });

    return {
      success: true,
      message: isFakeRecipient ? 'Transfer to outside user' : 'Transfer successful',
      senderBalance: sender.balance,
    };
  }

  // ---------------------------
  // ADMIN: REVERSE PAYMENT
  // ---------------------------
  async reversePayment(userId: number, amount: number) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    user.balance = Number(user.balance) + Number(amount);
    await this.usersRepo.save(user);

    await transporter.sendMail({
      from: '"NexTrade" <noreply.nexttrade@gmail.com>',
      to: user.email,
      subject: 'Payment Reversal - NexTrade',
      html: `
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
                <span style="color:#009900;font-size:18px;">$${Number(amount || 0).toFixed(2)}</span> 
                has been <strong>credited back</strong> to your account.
              </p>

              <table width="100%" cellpadding="5" cellspacing="0" style="margin:20px 0;border:1px solid #e0e0e0;">
                <tr style="background:#f4f4f4;">
                  <td style="font-size:14px;">Reversal Amount:</td>
                  <td style="font-size:14px;"><strong>$${Number(amount || 0).toFixed(2)}</strong></td>
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
    `,
    });

    return { success: true, message: 'Payment reversed and email sent', newBalance: user.balance };
  }

  // ---------------------------
  // ADMIN: DELETE USER
  // ---------------------------
  async deleteUser(id: number) {
    const result = await this.usersRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('User not found');

    return { message: 'User deleted successfully' };
  }

  // ---------------------------
  // ADMIN: RESET BALANCE
  // ---------------------------
  async resetBalance(id: number) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    user.balance = 0;
    await this.usersRepo.save(user);

    return { message: 'Balance reset', newBalance: 0 };
  }

  // ---------------------------
  // ADMIN: FUND ACCOUNT
  // ---------------------------
  async fundAccount(id: number, amount: number) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    user.balance = Number(user.balance) + Number(amount);
    await this.usersRepo.save(user);

    await this.notificationsService.create(
      user,
      'Debit Alert',
      `$${amount} has been deducted from your account.`,
    );

    return { message: 'Account funded', newBalance: user.balance };
  }

  // ---------------------------
  // ADMIN: RESTRICT USER
  // ---------------------------
  async restrictUser(id: number, restricted: boolean) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    user.restricted = restricted;
    await this.usersRepo.save(user);

    return {
      message: restricted ? 'User restricted' : 'User unrestricted',
    };
  }

  async updateUser(user: User): Promise<User> {
    return await this.usersRepo.save(user);
  }

  async sendFundNotification(user: any, amount: number) {
    const mailOptions = {
      from: '"NexTrade" <noreply.nexttrade@gmail.com>',
      to: user.email,
      subject: 'Your NexTrade Account Has Been Credited',
      html: `
      <h2>Hi ${user.firstName},</h2>
      <p>Your NexTrade wallet has just been <strong>credited</strong>.</p>

      <p><strong>Amount:</strong> $${amount}</p>
      <p><strong>New Balance:</strong> $${user.balance}</p>

      <p>You can now login to your NexTrade app to view the updated balance.</p>

      <p>Best regards,<br/>SwiftPay Team</p>
    `,
    };

    await transporter.sendMail(mailOptions);
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  // user.service.ts
  generateHedgingAccountNumber(): string {
    const random = Math.floor(100000000 + Math.random() * 900000000);
    return `MT5-${random}-HDG`;
  }

  async createMT5Account(userId: string) {
    const user = await this.usersRepo.findOne({
      where: { id: Number(userId) },
    });

    if (!user) throw new NotFoundException("User not found");

    // Generate main MT5 account number
    if (!user.mt5AccountNumber) {
      const random = Math.floor(100000000 + Math.random() * 900000000);
      user.mt5AccountNumber = `MT5-${random}-HDG`;
    }

    // Also generate the shorter trading account code if missing
    if (!user.accountNumber) {
      user.accountNumber = String(Math.floor(100000000 + Math.random() * 900000000));
    }

    // Initial MT5 trading account info
    user.accountBalance = user.accountBalance ?? 0;
    user.freeMargin = user.freeMargin ?? 0;
    user.leverage = "1:500";

    return await this.usersRepo.save(user);
  }
}
