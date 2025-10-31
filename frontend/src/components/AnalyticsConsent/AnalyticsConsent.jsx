import { useEffect, useState } from 'react';
import { pageview } from '../../utils/gtag';

function injectGtagScript(id) {
  return new Promise((resolve, reject) => {
    if (!id) return reject(new Error('No GA ID'));
    if (typeof window === 'undefined') return reject(new Error('No window'));
    // already loaded?
    if (window.gtag && typeof window.gtag === 'function') return resolve();

    const src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', (e) => reject(e));
      return;
    }

    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = (e) => reject(e);
    document.head.appendChild(s);
  });
}

function initGtag(id) {
  // Initialize dataLayer and gtag if not already
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); } // eslint-disable-line no-inner-declarations
  window.gtag = window.gtag || gtag;
  // prevent automatic page_view on config; we'll send pageviews manually
  window.gtag('js', new Date());
  window.gtag('config', id, { send_page_view: false });
}

export default function AnalyticsConsent() {
  const [status, setStatus] = useState(() => {
    try {
      return localStorage.getItem('capsule_analytics_consent');
    } catch (e) {
      return null;
    }
  });

  const GA_ID = typeof window !== 'undefined' ? window.__GA_MEASUREMENT_ID__ : undefined;

  useEffect(() => {
    // If user already granted, load analytics
    if (status === 'granted' && GA_ID) {
      // load & init
      injectGtagScript(GA_ID)
        .then(() => initGtag(GA_ID))
        .then(() => {
          // fire an initial pageview
          pageview(window.location.pathname + window.location.search);
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.warn('Analytics load failed', e);
        });
    }
  }, [status, GA_ID]);

  const accept = async () => {
    try {
      localStorage.setItem('capsule_analytics_consent', 'granted');
      setStatus('granted');
    } catch (e) {
      setStatus('granted');
    }
  };

  const decline = () => {
    try {
      localStorage.setItem('capsule_analytics_consent', 'denied');
      setStatus('denied');
    } catch (e) {
      setStatus('denied');
    }
  };

  // Don't show the banner if already decided or no GA configured
  if (status === 'granted' || status === 'denied' || !GA_ID) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 max-w-xl w-[95%] md:w-auto">
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg px-4 py-3 flex items-center gap-4">
        <div className="flex-1">
          <div className="font-semibold">We use analytics</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">We'd like to collect anonymous usage data to improve the site. Accept to enable analytics.</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={decline} className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm">Decline</button>
          <button onClick={accept} className="px-3 py-1 rounded bg-blue-600 text-white text-sm">Accept</button>
        </div>
      </div>
    </div>
  );
}
