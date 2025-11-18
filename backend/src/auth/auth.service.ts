import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import { User } from '../users/users.entity';

// GLOBAL transporter (recommended)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'noreply.nexttrade@gmail.com',
    pass: 'kruo claw boaa hklk', // Google App Password
  },
});

@Injectable()
export class AuthService {
  constructor(
    private readonly notificationsService: NotificationsService,

    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,   // ✔ FIXED

    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // REGISTER
  async register(country: string, email: string, password: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) throw new BadRequestException('Email already in use');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create({
      country,
      email,
      password: hashedPassword,
    });

    return { message: 'Registration successful', user };
  }

  // LOGIN
  async login(email: string, password: string) {
  const user = await this.usersService.findByEmail(email);
  if (!user) throw new UnauthorizedException("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new UnauthorizedException("Invalid credentials");

  // Generate login verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  user.loginCode = code;
  user.loginCodeExpires = Date.now() + 5 * 60 * 1000; // valid 5 mins

  await this.usersService.updateUser(user);

  // Send email
  await transporter.sendMail({
    from: '"NexTrade Login" <noreply.nexttrade@gmail.com>',
    to: user.email,
    subject: "Your NexTrade Login Verification Code",
    html: `
      <h2>Your NexTrade Login Code</h2>
      <p>Use this code to complete your login:</p>
      <h1>${code}</h1>
      <p>This code will expire in 5 minutes.</p>
    `,
  });

  return {
    status: "verify",
    message: "A login verification code has been sent to your email.",
    email, // needed for next step
  };
}


  // -----------------------------------
  // ADMIN ACTIONS
  // -----------------------------------

  // DELETE USER
  async deleteUser(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    await this.usersService.deleteUser(user.id);
    return { message: 'User deleted successfully' };
  }

  // RESET BALANCE
  async resetBalance(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    user.balance = 0;
    await this.usersService.updateUser(user);

    return { message: 'Balance reset successfully' };
  }

  // FUND ACCOUNT
  async fundAccount(email: string, amount: number) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    user.balance = Number(user.balance) + Number(amount);
    await this.usersService.updateUser(user);

    // ✅ Send fund notification
    await this.usersService.sendFundNotification(user, amount);

    await this.notificationsService.create(
      user,
      'Account Funded',
      `$${amount} has been added to your account.`
    );

    return { message: 'Account funded successfully', newBalance: user.balance };
  }

  // RESTRICT OR UNRESTRICT USER
  async restrictUser(email: string, restricted: boolean) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    user.restricted = restricted;
    await this.usersService.updateUser(user);

    return {
      message: restricted ? 'User restricted' : 'User unrestricted',
    };
  }

// ----------------------------------------
// REQUEST RESET CODE
// ----------------------------------------
async requestPasswordReset(email: string) {
  const user = await this.usersRepo.findOne({ where: { email } });
  if (!user) {
    throw new NotFoundException("No user found with this email");
  }

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Store reset code temporarily in user
  user.resetCode = code;
  await this.usersRepo.save(user);

  // Send email
  await this.sendEmail(
    email,
    "Your NexTrade Password Reset Code",
    `
      <h2>Password Reset Request</h2>
      <p>Your password reset code is:</p>
      <h1>${code}</h1>
      <p>This code is valid for 10 minutes.</p>
    `
  );

  return { message: "Reset code sent to your email." };
}

// ----------------------------------------
// CONFIRM RESET
// ----------------------------------------
async confirmPasswordReset(email: string, code: string, newPassword: string) {
  const user = await this.usersRepo.findOne({ where: { email } });

  if (!user) {
    throw new NotFoundException("No user found");
  }

  if (user.resetCode !== code) {
    throw new BadRequestException("Invalid reset code");
  }

  // Set new password
  user.password = await bcrypt.hash(newPassword, 10);
  user.resetCode = null; // clear code
  await this.usersRepo.save(user);

  return { message: "Password reset successful." };
}

// EMAIL SENDER (reuse your pattern)
private async sendEmail(to: string, subject: string, html: string) {
  await transporter.sendMail({
    from: '"NexTrade" <noreply.nexttrade@gmail.com>',
    to,
    subject,
    html,
  });
}

async verifyLoginCode(email: string, code: string) {
  const user = await this.usersService.findByEmail(email);

  if (!user) throw new UnauthorizedException("User not found");

  if (user.loginCode !== code)
    throw new UnauthorizedException("Invalid verification code");

  if (Date.now() > Number(user.loginCodeExpires))
    throw new UnauthorizedException("Verification code expired");

  // Clear login code
  user.loginCode = null;
  user.loginCodeExpires = null;
  await this.usersService.updateUser(user);

  // Issue final JWT
  const token = this.jwtService.sign({
    id: user.id,
    email: user.email,
  });

  return {
    status: "success",
    message: "Login verified.",
    token,
    user,
  };
}
}
