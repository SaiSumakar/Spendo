import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import express from 'express';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private accessCookie = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 15 * 60 * 1000, // 15 minutes
  };

  private refreshCookie = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };


  @Post('signup')
  async signup(@Body() dto: CreateUserDto, @Res({ passthrough: true }) res: express.Response) {
    const { access_token, refresh_token, user } = await this.authService.signup(dto);
    this.setAuthCookies(res, access_token, refresh_token);
    return { user };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: express.Response) {
    const { access_token, refresh_token, user } = await this.authService.login(loginDto.email, loginDto.password);
    this.setAuthCookies(res, access_token, refresh_token);
    return { user };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@CurrentUser('userId') userId: string, @Res({ passthrough: true }) res: express.Response) {
    res.clearCookie('Authentication', this.accessCookie);
    res.clearCookie('Refresh', this.refreshCookie);
    
    await this.authService.logout(userId);
    return { message: 'Logged out' };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  changePassword(@CurrentUser('userId') userId: string, @Body() dto: ChangePasswordDto ) {
    return this.authService.changePassword(userId, dto);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@CurrentUser() user: { userId: string, refreshToken: string }, @Res({ passthrough: true }) res: express.Response) {

    const tokens = await this.authService.refreshTokens(user.userId, user.refreshToken);
    this.setAuthCookies(res, tokens.access_token, tokens.refresh_token);

    return { user: tokens.user };
  }

  private setAuthCookies(res: express.Response, access: string, refresh: string) {
    res.cookie('Authentication', access, this.accessCookie);
    res.cookie('Refresh', refresh, this.refreshCookie);
  }
}
