import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<number>('SMTP_PORT') === 465, // optional
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendOtpEmail(to: string, otp: string, purpose = 'Confirm your new email address') {
    const appName = this.configService.get<string>('APP_NAME') ?? 'Spendo';

    const { html, text } = this.buildOtpTemplate({
      appName,
      otp,
      purpose,
      expiresMinutes: 10,
    });

    await this.transporter.sendMail({
      from: this.configService.get<string>('SMTP_FROM'),
      to,
      subject: `${appName} — Your verification code`,
      text,
      html,
    });
  }

  private buildOtpTemplate(opts: {
    appName: string;
    otp: string;
    purpose: string;
    expiresMinutes: number;
  }) {
    const { appName, otp, purpose, expiresMinutes } = opts;

    const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#f6f7fb;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:40px 16px;">
            
            <table width="100%" style="max-width:520px;background:#ffffff;border-radius:12px;padding:32px;border:1px solid #e5e7eb;">
              
              <tr>
                <td align="center" style="padding-bottom:16px;">
                  <h2 style="margin:0;color:#111827;">${appName}</h2>
                </td>
              </tr>

              <tr>
                <td style="padding:8px 0 16px 0;">
                  <p style="margin:0;font-size:16px;color:#111827;">
                    Your verification code for <strong>${purpose}</strong>
                  </p>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding:24px 0;">
                  <div style="
                    font-size:32px;
                    letter-spacing:6px;
                    font-weight:bold;
                    background:#111827;
                    color:#ffffff;
                    padding:18px 24px;
                    border-radius:10px;
                    display:inline-block;
                  ">
                    ${otp}
                  </div>
                </td>
              </tr>

              <tr>
                <td>
                  <p style="margin:0 0 8px 0;color:#374151;font-size:14px;">
                    This code expires in <strong>${expiresMinutes} minutes</strong>.
                  </p>

                  <p style="margin:0;color:#6b7280;font-size:13px;">
                    If you didn’t request this, you can safely ignore this email.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding-top:24px;">
                  <hr style="border:none;border-top:1px solid #e5e7eb;" />
                  <p style="font-size:12px;color:#9ca3af;margin-top:16px;">
                    For security reasons, never share this code with anyone.
                  </p>
                </td>
              </tr>

            </table>

            <p style="font-size:12px;color:#9ca3af;margin-top:16px;">
              © ${new Date().getFullYear()} ${appName}
            </p>

          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    const text = `
      ${appName} verification code

      Purpose: ${purpose}
      Code: ${otp}

      Expires in ${expiresMinutes} minutes.

      If you did not request this, ignore this email.
      Never share this code with anyone.
      `;

    return { html, text };
  }
}
