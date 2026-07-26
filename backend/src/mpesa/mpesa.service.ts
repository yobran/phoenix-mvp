import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { StkPushDto } from './dto/stk-push.dto';

@Injectable()
export class MpesaService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async getAccessToken(): Promise<string> {
    const consumerKey = this.config.get<string>('MPESA_CONSUMER_KEY');
    const consumerSecret = this.config.get<string>('MPESA_CONSUMER_SECRET');

    console.log('Consumer Key:', consumerKey);
    console.log('Consumer Secret:', consumerSecret);

    const auth = Buffer.from(
      `${consumerKey}:${consumerSecret}`,
    ).toString('base64');

    try {
      const response = await firstValueFrom(
        this.http.get(
          'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
          {
            headers: {
              Authorization: `Basic ${auth}`,
            },
          },
        ),
      );

      return response.data.access_token;
    } catch (error: any) {
      console.log('Status:', error.response?.status);
      console.log('Response:', error.response?.data);
      console.log('Message:', error.message);
      throw error;
    }
  }

  private generateTimestamp(): string {
    const now = new Date();

    return (
      now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0') +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0')
    );
  }

  private generatePassword(timestamp: string): string {
    const shortcode = this.config.get<string>('MPESA_SHORTCODE');
    const passkey = this.config.get<string>('MPESA_PASSKEY');

    return Buffer.from(
      `${shortcode}${passkey}${timestamp}`,
    ).toString('base64');
  }

  async stkPush(dto: StkPushDto) {
    const accessToken = await this.getAccessToken();

    const timestamp = this.generateTimestamp();
    const password = this.generatePassword(timestamp);

    try {
      const response = await firstValueFrom(
        this.http.post(
          'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
          {
            BusinessShortCode: this.config.get('MPESA_SHORTCODE'),
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: dto.amount,
            PartyA: dto.phone,
            PartyB: this.config.get('MPESA_SHORTCODE'),
            PhoneNumber: dto.phone,
            CallBackURL: this.config.get('MPESA_CALLBACK_URL'),
            AccountReference: dto.accountReference,
            TransactionDesc: dto.transactionDesc,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        ),
      );

      return response.data;
    } catch (error: any) {
      console.log('Status:', error.response?.status);
      console.log('Response:', error.response?.data);
      console.log('Message:', error.message);
      throw error;
    }
  }
}
