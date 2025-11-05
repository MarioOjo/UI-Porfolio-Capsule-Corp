import { Helmet } from 'react-helmet-async';

/**
 * ProductSchema Component
 * Adds structured data (JSON-LD) for product pages to improve SEO
 * and enable rich snippets in search results
 */
function ProductSchema({ product }) {
  if (!product) return null;

  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.image || (product.gallery && product.gallery[0]),
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "Capsule Corp"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://capsulecorps.dev/products/${product.slug}`,
      "priceCurrency": "USD",
      "price": product.price,
      "availability": product.in_stock || product.inStock 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  // Add rating if available
  if (product.rating || product.averageRating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": product.rating || product.averageRating || 5,
      "reviewCount": product.reviewCount || 1
    };
  }

  // Add category
  if (product.category) {
    schema.category = product.category;
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
      <title>{product.name} - Capsule Corp</title>
      <meta name="description" content={product.description} />
      <meta property="og:title" content={`${product.name} - Capsule Corp`} />
      <meta property="og:description" content={product.description} />
      <meta property="og:image" content={product.image || (product.gallery && product.gallery[0])} />
      <meta property="og:url" content={`https://capsulecorps.dev/products/${product.slug}`} />
      <meta property="og:type" content="product" />
      <meta property="product:price:amount" content={product.price} />
      <meta property="product:price:currency" content="USD" />
      <link rel="canonical" href={`https://capsulecorps.dev/products/${product.slug}`} />
    </Helmet>
  );
}

export default ProductSchema;
