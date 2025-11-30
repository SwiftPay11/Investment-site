import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UnauthorizedException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const { country, email, password } = registerDto;
    return this.authService.register(country, email, password);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    return this.authService.login(email, password);
  }

  @Post("update-profile")
  async updateProfile(@Body() dto: any) {
    return this.authService.updateProfile(dto);
  }

@Post("admin-login")
async adminLogin(@Body() body) {
  const { email, password } = body;

  const token = await this.authService.adminLogin(email, password);

  return { token };
}


  @Delete('admin/delete/:email')
  async deleteUser(@Param('email') email: string) {
    return this.authService.deleteUser(email);
  }

  @Post('admin/reset-balance')
  async resetBalance(@Body() body: { email: string }) {
    return this.authService.resetBalance(body.email);
  }

  @Post('admin/fund')
  async fundAccount(@Body() body: { email: string; amount: number }) {
    return this.authService.fundAccount(body.email, body.amount);
  }

  @Post('admin/restrict')
  async restrictUser(@Body() body: { email: string; restricted: boolean }) {
    return this.authService.restrictUser(body.email, body.restricted);
  }

  @Post("reset-password")
  async requestReset(@Body("email") email: string) {
    return this.authService.requestPasswordReset(email);
  }

  @Post("confirm-reset")
  async confirmReset(
    @Body("email") email: string,
    @Body("code") code: string,
    @Body("newPassword") newPassword: string
  ) {
    return this.authService.confirmPasswordReset(email, code, newPassword);
  }

  @Post("verify-login")
  verifyLogin(@Body() body: { email: string; code: string }) {
    return this.authService.verifyLoginCode(body.email, body.code);
  }
}
