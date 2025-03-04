import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsService } from '../features/analytics/AnalyticsService';

export function withAnalytics<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  pageName: string
) {
  return function WithAnalyticsComponent(props: P) {
    const location = useLocation();

    useEffect(() => {
      analyticsService.trackPageView(`${pageName}: ${location.pathname}`);
      
      return () => {
        analyticsService.trackEvent({
          category: 'Page',
          action: 'Exit',
          label: pageName,
        });
      };
    }, [location.pathname]);

    return <WrappedComponent {...props} />;
  };
} 