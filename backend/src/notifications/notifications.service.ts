import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notifications.entity';
import { User } from '../users/users.entity';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notifRepo: Repository<Notification>,
    private gateway: NotificationsGateway,
  ) {}

  async getUserNotifications(userId: number) {
    return this.notifRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  // ✅ This is the ONLY valid markAsRead method
  async markAsRead(id: number) {
    return this.notifRepo.update(id, { read: true });
  }

  async create(user: User, title: string, message: string) {
    const n = this.notifRepo.create({
      user,
      title,
      message,
    });
    const saved = await this.notifRepo.save(n);

    // send live notification
    this.gateway.sendNotification(user.id, saved);

    return saved;
  }

  async getUnreadCount(userId: number) {
    return this.notifRepo.count({
      where: {
        user: { id: userId },
        read: false,
      },
    });
  }
}
