import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/users.entity';
import { Resend } from 'resend';

@Injectable()
export class AuthService {
  private resend: Resend;

  constructor(
    private readonly notificationsService: NotificationsService,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

 // REGISTER
async register(dto: any) {
  // 1. Check if email already exists
  const existingUser = await this.usersService.findByEmail(dto.email);
  if (existingUser) {
    throw new BadRequestException("Email already in use");
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(dto.password, 10);

  // 3. Manually create a new User instance (NO create() call)
  const user = new User();
  user.email = dto.email;
  user.password = hashedPassword;
  user.country = dto.country;
  user.fullname = ""; // will be filled from credentials later
  user.phone = "";
  user.gender = "";
  user.dob = "";

  // 4. Save user
  const saved = await this.usersRepo.save(user);

  // 5. Return full user object to frontend
  return saved;
}


  // LOGIN
  async login(email: string, password: string) {
  const user = await this.usersService.findByEmail(email);
  if (!user) throw new UnauthorizedException("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new UnauthorizedException("Invalid credentials")

  await this.usersService.updateUser(user);
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
  await this.resend.emails.send({
    from: 'NexTrad <noreply@nextrade.pro>',
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

async adminLogin(email: string, password: string) {
  const admin = await this.usersRepo.findOne({ where: { email } });

  if (!admin || !admin.isAdmin) {
    throw new UnauthorizedException("Admin not found");
  }

  // Plain text check
  if (password !== admin.password) {
    throw new UnauthorizedException("Invalid admin password");
  }

  return { token: "admin-verified", adminId: admin.id };
}

async updateProfile(dto: any) {
  const user = await this.usersRepo.findOne({ where: { email: dto.email } });

  if (!user) throw new NotFoundException("User not found");

  user.fullname = dto.fullname;
  user.phone = dto.phone;
  user.dob = dto.dob;
  user.gender = dto.gender;   // optional
  user.country = dto.country; // optional

  await this.usersRepo.save(user);
  return user;
  }
}
