import { Type } from '@nestjs/common';
import { MessageInterface } from '../../../libs/mail/messages/message.interface';
import { ChannelInterface } from '../../../libs/notification/channels/channel.interface';
import { MailChannel } from '../../../libs/notification/channels/mail.channel';
import { NotificationInterface } from '../../../libs/notification/notification.interface';
import { NotificationTemplate } from '../../../libs/notification/notification.template';
import { emailSubjectAppName, fakeTrans } from '../../helpers/functions';
import { User } from '../../models/db/user.model';

export class MailVerificationNotification implements NotificationInterface {
  data: any;
  constructor(data) {
    this.data = data;
  }

  broadcastOn(): Type<ChannelInterface>[] {
    return [MailChannel];
  }

  async toMail(notifiable: User): Promise<MessageInterface> {
    return (
      await NotificationTemplate.toEmail('verify_email.html', {
        subject:
          (await emailSubjectAppName()) + ' ' + fakeTrans('Email Verification'),
        name: `${notifiable.nickname || notifiable.usercode}`,
        email: notifiable.email,
        verification_code: this.data.verification_code,
      })
    ).to(notifiable.email);
  }

  queueable(): boolean {
    return false;
  }
}
