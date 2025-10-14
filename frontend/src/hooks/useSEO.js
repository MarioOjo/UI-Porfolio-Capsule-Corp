import { useEffect } from 'react';

const useSEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  price,
  availability 
}) => {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = `${title} | Capsule Corp`;
    }

    // Update meta tags
    const updateMetaTag = (name, content, property = false) => {
      if (!content) return;
      
      const attribute = property ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (tag) {
        tag.setAttribute('content', content);
      } else {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        tag.setAttribute('content', content);
        document.head.appendChild(tag);
      }
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);

    // Twitter tags
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', image, true);

    // Product-specific structured data
    if (type === 'product' && price) {
      const structuredData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": title,
        "description": description,
        "image": image,
        "offers": {
          "@type": "Offer",
          "price": price,
          "priceCurrency": "USD",
          "availability": availability || "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "Capsule Corp"
          }
        }
      };

      let scriptTag = document.querySelector('#structured-data');
      if (scriptTag) {
        scriptTag.textContent = JSON.stringify(structuredData);
      } else {
        scriptTag = document.createElement('script');
        scriptTag.id = 'structured-data';
        scriptTag.type = 'application/ld+json';
        scriptTag.textContent = JSON.stringify(structuredData);
        document.head.appendChild(scriptTag);
      }
    }

    // Cleanup function
    return () => {
      // Reset to default title if component unmounts
      document.title = 'Capsule Corp - Premium Dragon Ball Z Tech & Gear';
    };
  }, [title, description, keywords, image, url, type, price, availability]);
};

export default useSEO;