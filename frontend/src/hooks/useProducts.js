import { useQuery } from '@tanstack/react-query';
import apiFetch from '../utils/api';
import { products as localProducts } from '../data/products';

const BROKEN_PLACEHOLDER_IMAGE = 'v1759096629/d3_xdolmn.jpg';
const SLUG_IMAGE_ALIASES = {
  'senzu-bean-pack-10': 'senzu-bean-pack',
  'gravity-training-room': 'gravity-chamber-personal',
  'weighted-training-gi': 'weighted-training-clothes',
  'power-level-scouter': 'power-scouter-elite',
  'storage-capsule-1': 'laboratory-capsule',
  'vehicle-capsule-3': 'vehicle-capsule-set',
  'capsule-house-5': 'house-capsule-pro',
};

export function hydrateProductMedia(product) {
  if (!product) return product;

  const localMatch = localProducts.find((p) =>
    (p.slug && product.slug && p.slug === product.slug) ||
    (p.name && product.name && p.name.toLowerCase() === product.name.toLowerCase())
  );

  const aliasSlug = product.slug ? SLUG_IMAGE_ALIASES[product.slug] : null;
  const aliasMatch = aliasSlug
    ? localProducts.find((p) => p.slug === aliasSlug)
    : null;

  const mediaSource = localMatch || aliasMatch;

  if (!mediaSource) return product;

  const image = String(product.image || '').trim();
  const gallery = Array.isArray(product.gallery) ? product.gallery : [];
  const hasUsableImage = Boolean(image) && !image.includes(BROKEN_PLACEHOLDER_IMAGE);
  const hasUsableGallery = gallery.some((g) => typeof g === 'string' && g.trim() && !g.includes(BROKEN_PLACEHOLDER_IMAGE));

  if (hasUsableImage || hasUsableGallery) return product;

  return {
    ...product,
    image: mediaSource.image || product.image,
    gallery: Array.isArray(mediaSource.gallery) && mediaSource.gallery.length ? mediaSource.gallery : gallery,
  };
}

// Query key helpers
export const productKeys = {
  all: ['products'],
  lists: () => [...productKeys.all, 'list'],
  list: (filters = {}) => [...productKeys.lists(), { filters }],
  details: () => [...productKeys.all, 'detail'],
  detail: (id) => [...productKeys.details(), id],
  slug: (slug) => [...productKeys.all, 'slug', slug],
  featured: () => [...productKeys.all, 'featured'],
  category: (category) => [...productKeys.all, 'category', category],
  search: (query) => [...productKeys.all, 'search', query],
};

async function fetchProducts(filters = {}) {
  const params = new URLSearchParams();
  if (filters.featured) params.append('featured', 'true');
  if (filters.category) params.append('category', filters.category);
  if (filters.search) params.append('search', filters.search);
  if (filters.limit) params.append('limit', String(filters.limit));
  if (filters.page) params.append('page', String(filters.page));
  const qs = params.toString();
  const path = `/api/products${qs ? `?${qs}` : ''}`;
  const body = await apiFetch(path);
  
  // Handle both paginated { products: [...], pagination: {...} } and non-paginated { products: [...] } responses
  if (Array.isArray(body)) {
    // Old format: direct array
    return body.map(hydrateProductMedia);
  }
  return (body?.products || []).map(hydrateProductMedia);
}

export function useProducts(filters = {}, options = {}) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => fetchProducts(filters),
    keepPreviousData: true,
    ...options,
  });
}

export function useFeaturedProducts(options = {}) {
  return useProducts({ featured: true }, options);
}

export function useProductBySlug(slug, options = {}) {
  return useQuery({
    queryKey: productKeys.slug(slug),
    queryFn: async () => {
      const body = await apiFetch(`/api/products/slug/${slug}`);
      return hydrateProductMedia(body?.product ?? null);
    },
    enabled: !!slug,
    ...options,
  });
}

export default useProducts;
