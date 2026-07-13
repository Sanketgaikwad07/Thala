import { v4 as uuid } from 'uuid';
import { db } from '../../data/db';
import { ApiError } from '../../utils/ApiError';
import { sendPushNotification } from '../../config/firebase';
import { Notification } from '../../types/models';

export function listNotifications(userId: string) {
  return db.notifications.filter((n) => n.userId === userId).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function markAsRead(userId: string, id: string) {
  const notification = db.notifications.find((n) => n.id === id && n.userId === userId);
  if (!notification) throw ApiError.notFound('Notification not found');
  notification.read = true;
  return notification;
}

export function markAllAsRead(userId: string) {
  db.notifications.filter((n) => n.userId === userId).forEach((n) => (n.read = true));
  return { message: 'All notifications marked as read' };
}

export async function createAndSend(userId: string, title: string, body: string, type: Notification['type']) {
  const notification: Notification = {
    id: uuid(),
    userId,
    title,
    body,
    type,
    read: false,
    createdAt: new Date().toISOString(),
  };
  db.notifications.push(notification);
  await sendPushNotification({ userId, title, body });
  return notification;
}
