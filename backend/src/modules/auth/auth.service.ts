import { BadGatewayException, BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDto } from './dto/change-password.dto';

import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { MailService } from 'src/common/mail/mail.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private config: ConfigService,
        private mail: MailService,
        @InjectRedis() private redis: Redis,
    ) {}


    async signup(dto: CreateUserDto) {
        const user = await this.userService.create(dto)
        return this.generateTokens(user);
    }

    async login(email: string, password: string) {
        const user = await this.userService.findByEmail(email);

        if(!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            throw new UnauthorizedException('Invalid credentials')
        }

        return this.generateTokens(user);
    }

    async changePassword(userId: string, dto: ChangePasswordDto) {
        const { oldPassword, newPassword, confirmNewPassword } = dto;

        if(newPassword !== confirmNewPassword) {
            throw new BadRequestException('Passwords do not match');
        }

        const user = await this.userService.findByIdWithPassword(userId);
        if(!user) {
            throw new NotFoundException(`User with id ${userId} not found`);
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if(!isMatch) {
            throw new BadRequestException('Old password is incorrect');
        }

        const newPassHash = await bcrypt.hash(newPassword, 10);
        await this.userService.updatePassword(userId, newPassHash);
        // invalidate refresh tokens
        await this.userService.clearRefreshTokenHash(userId);

        return { 
            message: 'Password updated successfully',
            requireReauth: true,
        };
    }

    async logout(userId: string) {
        await this.userService.clearRefreshTokenHash(userId);
    }

    async refreshTokens(userId: string, refreshToken: string) {
        const user = await this.userService.findByIdWithRefresh(userId);

        if (!user || !user.refreshTokenHash) {
            throw new UnauthorizedException();
        }

        const valid = await bcrypt.compare(
            refreshToken,
            user.refreshTokenHash,
        );

        if (!valid) throw new UnauthorizedException();

        return this.generateTokens(user); // rotation happens here
    }


    private async generateTokens(user: any) {
        const payload = { email: user.email, sub: user.id };
        const access_token = this.signAccessToken(payload);
        const refresh_token = this.signRefreshToken(payload);

        await this.setRefreshToken(user.id, refresh_token);

        return {
            access_token,
            refresh_token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            }
        }
    }

    private signAccessToken(payload) {
        return this.jwtService.sign(
            payload,
            {
            secret: this.config.get('JWT_ACCESS_SECRET'),
            expiresIn: this.config.get('JWT_ACCESS_EXPIRY'),
            },
        );
    }

    private signRefreshToken(payload) {
        return this.jwtService.sign(
            payload,
            {
            secret: this.config.get('JWT_REFRESH_SECRET'),
            expiresIn: this.config.get('JWT_REFRESH_EXPIRY'),
            },
        );
    }

    private async setRefreshToken(userId: string, token: string) {
        const hash = await bcrypt.hash(token, 10);
        await this.userService.updateRefreshTokenHash(userId, hash);
    }

    private generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    private key(userId: string) {
        return `email-change:${userId}`;
    }

    async sendEmailChangeOtp(userId: string, newEmail: string) {
        console.log("redis url", this.config.get('REDIS_URL'))
        const exists = await this.userService.findByEmail(newEmail);
        if (exists) throw new BadRequestException('Email already in use');

        const otp = this.generateOtp();
        const hash = await bcrypt.hash(otp, 10);

        await this.redis.set(
            this.key(userId),
            JSON.stringify({
                newEmail,
                otpHash: hash,
                attempts: 0,
            }),
            'EX',
            600,
        );

        await this.mail.sendOtpEmail(newEmail, otp);

        return { message: 'OTP sent' };
    }

    async verifyEmailChangeOtp(userId: string, otp: string, email: string) {
        const raw = await this.redis.get(this.key(userId));
        if (!raw) throw new BadRequestException('OTP expired');

        const data = JSON.parse(raw);

        if (data.newEmail !== email) {
            throw new BadRequestException('Email mismatch');
        }

        if (data.attempts >= 5) {
            throw new BadRequestException('Too many attempts');
        }

        const match = await bcrypt.compare(otp, data.otpHash);
        if (!match) {
            data.attempts++;
            await this.redis.set(this.key(userId), JSON.stringify(data), 'EX', 600);
            throw new BadRequestException('Invalid OTP');
        }

        await this.userService.update(userId, { email });
        await this.userService.clearRefreshTokenHash(userId);
        await this.redis.del(this.key(userId));

        return {
            message: 'Email updated',
            requireReauth: true,
        };
    }

    async resendEmailChangeOtp(userId: string, email: string) {
        return this.sendEmailChangeOtp(userId, email);
    }


}
