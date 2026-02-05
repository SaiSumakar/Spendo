import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import express from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: CreateUserDto, @Res({ passthrough: true }) res: express.Response) {
    const { access_token, user } = await this.authService.signup(dto);
    this.setCookie(res, access_token);
    return { user };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: express.Response) {
    const { user, access_token } = await this.authService.login(loginDto.email, loginDto.password);
    this.setCookie(res, access_token);
    return { user };
  }

  private setCookie(res: express.Response, token: string) {
    res.cookie('Authentication', token, {
      httpOnly: true, // JS can't access this
      secure: process.env.NODE_ENV === "production", // https only in production
      sameSite: 'strict', // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
  }
}
