// Lightweight gtag helpers — reads GA ID from Vite env at build-time, with a runtime window fallback.
// Safe to call even if gtag isn't loaded; no-ops when missing.
const BUILD_GA_ID = typeof import.meta !== 'undefined' ? import.meta.env.VITE_GA_ID : undefined;
export const GA_ID = BUILD_GA_ID || (typeof window !== 'undefined' ? window.__GA_MEASUREMENT_ID__ : undefined);

export function hasGtag() {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

export function pageview(path) {
  try {
    if (!hasGtag()) return;
    // Use event page_view so we control when pageviews are sent (send_page_view was disabled on config)
    window.gtag('event', 'page_view', { page_path: path });
  } catch (e) {
    // swallow errors to avoid breaking the app
    // eslint-disable-next-line no-console
    console.warn('gtag pageview failed', e);
  }
}

export function event({ action, category, label, value }) {
  try {
    if (!hasGtag()) return;
    window.gtag('event', action, { event_category: category, event_label: label, value });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('gtag event failed', e);
  }
}
