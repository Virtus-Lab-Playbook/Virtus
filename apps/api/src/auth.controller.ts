import { Body, Controller, Get, Inject, Post, Req, Res } from '@nestjs/common';
import { IsEmail, IsString, MinLength } from 'class-validator';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';

class CredentialsDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

class RegisterDto extends CredentialsDto {
  @IsString()
  @MinLength(2)
  name!: string;
}

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly auth: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.auth.register(body.email, body.password, body.name);
    this.auth.setSession(response, result.token);
    return result.user;
  }

  @Post('login')
  async login(@Body() body: CredentialsDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.auth.login(body.email, body.password);
    this.auth.setSession(response, result.token);
    return result.user;
  }

  @Get('me')
  me(@Req() request: Request) {
    return this.auth.currentUser(request);
  }

  @Post('logout')
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    await this.auth.logout(request);
    this.auth.clearSession(response);
    return { ok: true };
  }
}
