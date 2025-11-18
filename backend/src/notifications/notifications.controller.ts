import { Controller, Get, Param, Patch } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private service: NotificationsService) {}

  @Get(':userId')
  async getUserNotifications(@Param('userId') userId: number) {
    return this.service.getUserNotifications(userId);
  }

  @Patch("mark-read/:id")
  async markRead(@Param("id") id: number) {
    return this.service.markAsRead(id);
  }

  @Get("unread-count/:userId")
  async unreadCount(@Param("userId") userId: number) {
    return this.service.getUnreadCount(userId);
  }
}
