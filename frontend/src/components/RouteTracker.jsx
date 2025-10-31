import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageview } from '../utils/gtag';

export default function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    // send a pageview for every route change
    try {
      pageview(location.pathname + location.search);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('RouteTracker pageview failed', e);
    }
  }, [location]);

  return null;
}
