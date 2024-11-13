// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'mail.mercurysols.org', // Use your SMTP host
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'fixit@mercurysols.org', // Your email username
        pass: 'MA_Uh;mUCFo#', // Your email password
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    try {
      const info = await this.transporter.sendMail({
        from: 'fixit@mercurysols.org', // Sender address
        to, // List of recipients
        subject, // Subject line
        text, // Plain text body
        html, // HTML body
      });
      console.log('Message sent: %s', info.messageId);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
