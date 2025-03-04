import { storage } from '../../utils/storage';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: number;
  read: boolean;
}

class NotificationService {
  private readonly STORAGE_KEY = 'notifications';
  private readonly MAX_NOTIFICATIONS = 50;

  getNotifications(): Notification[] {
    return storage.get<Notification[]>(this.STORAGE_KEY, [])
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const notifications = this.getNotifications();
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      read: false,
    };

    notifications.unshift(newNotification);
    
    if (notifications.length > this.MAX_NOTIFICATIONS) {
      notifications.pop();
    }

    storage.set(this.STORAGE_KEY, notifications);
  }

  markAsRead(id: string): void {
    const notifications = this.getNotifications();
    const updatedNotifications = notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    storage.set(this.STORAGE_KEY, updatedNotifications);
  }

  markAllAsRead(): void {
    const notifications = this.getNotifications();
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true,
    }));
    storage.set(this.STORAGE_KEY, updatedNotifications);
  }

  clearNotifications(): void {
    storage.set(this.STORAGE_KEY, []);
  }
}

export const notificationService = new NotificationService(); 