export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

class AnalyticsService {
  private isInitialized = false;

  init(trackingId: string): void {
    if (this.isInitialized) return;

    // Initialize analytics service (e.g., Google Analytics)
    // This is a placeholder for actual implementation
    console.log('Analytics initialized with tracking ID:', trackingId);
    this.isInitialized = true;
  }

  trackEvent(event: AnalyticsEvent): void {
    if (!this.isInitialized) {
      console.warn('Analytics not initialized');
      return;
    }

    // Track event (placeholder implementation)
    console.log('Event tracked:', event);
  }

  trackPageView(page: string): void {
    if (!this.isInitialized) {
      console.warn('Analytics not initialized');
      return;
    }

    // Track page view (placeholder implementation)
    console.log(`Page view: ${page}`);
  }

  trackError(error: Error): void {
    if (!this.isInitialized) {
      console.warn('Analytics not initialized');
      return;
    }

    // Track error (placeholder implementation)
    console.log('Error tracked:', error.message);
  }

  setUserProperties(properties: Record<string, string | number | boolean>): void {
    if (!this.isInitialized) {
      console.warn('Analytics not initialized');
      return;
    }

    // Set user properties (placeholder implementation)
    console.log('User properties set:', properties);
  }
}

export const analyticsService = new AnalyticsService(); 