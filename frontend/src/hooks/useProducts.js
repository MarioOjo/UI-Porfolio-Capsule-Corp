import { useQuery } from '@tanstack/react-query';
import apiFetch from '../utils/api';

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
    return body;
  }
  return body?.products || [];
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
      return body?.product ?? null;
    },
    enabled: !!slug,
    ...options,
  });
}

export default useProducts;
