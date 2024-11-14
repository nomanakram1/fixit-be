import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';

@Injectable()
export class MobilePhoneOtpService {
  private twilioClient;

  constructor(private configService: ConfigService) {
    this.twilioClient = twilio(
      this.configService.get<string>('TWILIO_ACCOUNT_SID'),
      this.configService.get<string>('TWILIO_AUTH_TOKEN'),
    );
  }

  generateOtp(): string {
    // Generate a 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtp(phoneNumber: string, otp: string): Promise<void> {
    try {
      const otpResp = await this.twilioClient.messages.create({
        body: `Your FIXIT OTP code is ${otp}`,
        from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
        to: phoneNumber,
      });
      console.log('Message sent: %s', otpResp);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
