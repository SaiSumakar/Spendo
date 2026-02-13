import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import express from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: express.Request) => req?.cookies?.Refresh,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: express.Request, payload: any) {
    const refreshToken = req.cookies?.Refresh;
    return {
      userId: payload.sub,
      email: payload.email,
      refreshToken,
    };
  }
}

