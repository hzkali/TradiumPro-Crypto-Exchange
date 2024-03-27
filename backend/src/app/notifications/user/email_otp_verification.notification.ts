import { NotificationInterface } from '../../../libs/notification/notification.interface';
import { Type } from '@nestjs/common';
import { ChannelInterface } from '../../../libs/notification/channels/channel.interface';
import { MailChannel } from '../../../libs/notification/channels/mail.channel';
import { User } from '../../models/db/user.model';
import { MessageInterface } from '../../../libs/mail/messages/message.interface';
import { NotificationTemplate } from '../../../libs/notification/notification.template';
import { emailSubjectAppName, fakeTrans } from '../../helpers/functions';

export class EmailOtpVerificationNotification implements NotificationInterface {
  data: any;
  constructor(data) {
    this.data = data;
  }

  broadcastOn(): Type<ChannelInterface>[] {
    return [MailChannel];
  }

  async toMail(notifiable: User): Promise<MessageInterface> {
    return await NotificationTemplate.toEmail('otp_email.html', {
      subject:
        (await emailSubjectAppName()) +
        ' ' +
        (this.data.subject || fakeTrans('OTP Verification')),
      name: `${notifiable.nickname || notifiable.usercode}`,
      email: notifiable.email,
      title: this.data.title || 'OTP',
      verification_code: this.data.verification_code,
      event_message: this.data.event_message,
    });
  }

  queueable(): boolean {
    return false;
  }
}
