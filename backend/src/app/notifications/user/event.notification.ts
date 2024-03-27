import { Type } from '@nestjs/common';
import {
  MessageInterface,
  NotificationDataInterface,
} from '../../../libs/mail/messages/message.interface';
import { ChannelInterface } from '../../../libs/notification/channels/channel.interface';
import { MailChannel } from '../../../libs/notification/channels/mail.channel';
import { NotificationInterface } from '../../../libs/notification/notification.interface';
import { NotificationTemplate } from '../../../libs/notification/notification.template';
import { appName, emailSubjectAppName } from '../../helpers/functions';
import { User } from '../../models/db/user.model';

export class EventNotification implements NotificationInterface {
  data: NotificationDataInterface;
  constructor(data: NotificationDataInterface) {
    this.data = data;
  }

  broadcastOn(): Type<ChannelInterface>[] {
    return [MailChannel];
  }

  async toMail(notifiable: User): Promise<MessageInterface> {
    const app_name = await appName();
    return await NotificationTemplate.toEmail('event.html', {
      subject:
        (await emailSubjectAppName()) +
        ' ' +
        (this.data.subject || app_name + ' Notification'),
      name: `${notifiable.nickname || notifiable.usercode}`,
      email: notifiable.email,
      title: this.data.title || app_name + ' Notification',
      description: this.data.description,
    });
  }

  queueable(): boolean {
    return false;
  }
}
