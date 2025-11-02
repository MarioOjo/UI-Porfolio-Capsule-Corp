// Helper to resolve a usable image src from various shapes the backend may return.
// Mirrors logic used in ProductCarousel to keep image resolution consistent.
export function resolveImageSrc(product, size = 300) {
  let img = product && (product.image || product.images || null);
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
    // If it's a relative path or just a filename, try Cloudinary absolute path (seeded data uses this)
    if (/^[\w-]+\.[a-z]{2,4}$/i.test(img) || img.indexOf('/') === -1) {
      return `https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_${size===80?80:400},h_${size===80?80:400},g_center/${img}`;
    }
    // Otherwise, assume it's a relative URL served from the static assets
    return img.startsWith('/') ? img : `/${img}`;
  } catch (e) {
    return `/assets/images/placeholder-${size === 80 ? '80' : '300'}.png`;
  }
}

export default resolveImageSrc;
