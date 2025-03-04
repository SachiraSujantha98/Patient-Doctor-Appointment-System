import { useCallback } from 'react';
import {
  format,
  formatDistance,
  isValid,
  parseISO,
  formatDistanceToNow,
  isToday,
  isTomorrow,
  isYesterday,
} from 'date-fns';

export const useDate = () => {
  const formatDate = useCallback((date: string | Date, pattern = 'PPP') => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      if (!isValid(dateObj)) return 'Invalid date';
      return format(dateObj, pattern);
    } catch {
      return 'Invalid date';
    }
  }, []);

  const formatRelative = useCallback((date: string | Date) => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      if (!isValid(dateObj)) return 'Invalid date';

      if (isToday(dateObj)) {
        return `Today at ${format(dateObj, 'p')}`;
      }
      if (isTomorrow(dateObj)) {
        return `Tomorrow at ${format(dateObj, 'p')}`;
      }
      if (isYesterday(dateObj)) {
        return `Yesterday at ${format(dateObj, 'p')}`;
      }

      return formatDistance(dateObj, new Date(), { addSuffix: true });
    } catch {
      return 'Invalid date';
    }
  }, []);

  const formatTimeAgo = useCallback((date: string | Date) => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      if (!isValid(dateObj)) return 'Invalid date';
      return formatDistanceToNow(dateObj, { addSuffix: true });
    } catch {
      return 'Invalid date';
    }
  }, []);

  const formatAppointmentDate = useCallback((date: string | Date) => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      if (!isValid(dateObj)) return 'Invalid date';

      if (isToday(dateObj)) {
        return `Today at ${format(dateObj, 'p')}`;
      }
      if (isTomorrow(dateObj)) {
        return `Tomorrow at ${format(dateObj, 'p')}`;
      }

      return format(dateObj, 'PPPp');
    } catch {
      return 'Invalid date';
    }
  }, []);

  return {
    formatDate,
    formatRelative,
    formatTimeAgo,
    formatAppointmentDate,
  };
}; 