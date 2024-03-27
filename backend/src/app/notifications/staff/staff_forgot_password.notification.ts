import { NotificationInterface } from '../../../libs/notification/notification.interface';
import { Type } from '@nestjs/common';
import { ChannelInterface } from '../../../libs/notification/channels/channel.interface';
import { MailChannel } from '../../../libs/notification/channels/mail.channel';
import { MessageInterface } from '../../../libs/mail/messages/message.interface';
import { NotificationTemplate } from '../../../libs/notification/notification.template';
import { Staff } from '../../models/db/staff.model';
import { emailSubjectAppName, fakeTrans } from '../../helpers/functions';

export class StaffForgotPasswordNotification implements NotificationInterface {
  data: any;
  constructor(data) {
    this.data = data;
  }

  broadcastOn(): Type<ChannelInterface>[] {
    return [MailChannel];
  }

  async toMail(notifiable: Staff): Promise<MessageInterface> {
    return (
      await NotificationTemplate.toEmail(
        'reset_password.html',
        {
          subject:
            (await emailSubjectAppName()) + ' ' + fakeTrans('Reset Password'),
          title: fakeTrans('Reset Password'),
          name: notifiable.name,
          email: notifiable.email,
          verification_code: this.data.verification_code,
        },
        'staff',
      )
    ).to(notifiable.email);
  }

  queueable(): boolean {
    return false;
  }
}
