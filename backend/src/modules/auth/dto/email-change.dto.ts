import { IsEmail, Length } from 'class-validator';

export class SendEmailChangeOtpDto {
  @IsEmail()
  email: string;
}

export class VerifyEmailChangeOtpDto {
  @Length(6, 6)
  otp: string;

  @IsEmail()
  email: string;
}
