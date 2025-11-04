// Centralized Cloudinary base so the host can be changed in one place.
export const CLOUDINARY_BASE = 'https://res.cloudinary.com/dx8wt3el4/image/upload';

// Helper to resolve a usable image src from various shapes the backend may return.
// Mirrors logic used in ProductCarousel to keep image resolution consistent.
// Accept either a product-like object or a raw image value (string/array).
export function resolveImageSrc(input, size = 300) {
  let img = null;
  // If caller passed a string or array directly, use it as the image source value
  if (typeof input === 'string' || Array.isArray(input)) {
    img = input;
  } else if (input && typeof input === 'object') {
    img = input.image || input.images || input.gallery || null;
  }
  try {
    if (!img) return `/assets/images/placeholder-${size === 80 ? '80' : '300'}.png`;
    // If stored as JSON array string, parse it
    if (typeof img === 'string' && img.trim().startsWith('[')) {
      const parsed = JSON.parse(img);
      if (Array.isArray(parsed) && parsed.length) img = parsed[0];
    }
  // If it's an array, pick first
  if (Array.isArray(img)) img = img[0];
    // If not a string after parsing, fallback
    if (!img || typeof img !== 'string') return `/assets/images/placeholder-${size === 80 ? '80' : '300'}.png`;
    img = img.trim();
    // If already absolute, return as-is
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    // If it's a relative filename (e.g. 'foo.jpg') assume Cloudinary hosted
    if (/^[\w-]+\.[a-z]{2,4}$/i.test(img) || img.indexOf('/') === -1) {
      return `${CLOUDINARY_BASE}/c_fill,w_${size===80?80:400},h_${size===80?80:400},g_center/${img}`;
    }
    // Otherwise, assume it's a relative URL served from the static assets
    return img.startsWith('/') ? img : `/${img}`;
  } catch (e) {
    return `/assets/images/placeholder-${size === 80 ? '80' : '300'}.png`;
  }
}

export default resolveImageSrc;
