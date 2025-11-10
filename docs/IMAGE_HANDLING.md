# Image Handling System - Capsule Corp E-Commerce

## Overview
This document explains the complete image handling system for the Capsule Corp e-commerce site, including how images are resolved, stored, and displayed across different contexts.

## Architecture

### 1. Image Resolution Function (`frontend/src/utils/images.js`)

**Purpose**: Centralized function to resolve product images from various data formats into usable URLs.

**Key Function**: `resolveImageSrc(input, size = 300)`

#### Parameters:
- `input`: Can be a string URL, array of URLs, or product object with image properties
- `size`: Image dimensions (80 for thumbnails, 300+ for larger displays)

#### Resolution Logic:

```javascript
1. Extract image from input
   - Direct string/array → use as-is
   - Object → check input.image, input.images, input.gallery

2. Handle JSON string arrays
   - Parse strings that start with '[' 
   - Extract first element

3. Handle arrays
   - Take first element from array

4. Resolve absolute URLs
   a) Cloudinary URLs with transformations → return as-is
   b) Cloudinary URLs without transformations → add transformations
   c) Non-Cloudinary URLs → return as-is

5. Handle relative filenames
   - Build full Cloudinary URL with transformations

6. Handle relative paths
   - Return with leading slash

7. Fallback
   - Return placeholder image if all else fails
```

#### Transformation Sizes:
- **size = 80**: 80x80px (for cart thumbnails, nav previews)
- **size = 300+**: 400x400px (for product cards, detail pages)

#### Cloudinary Transformations:
- **Crop**: `c_fill` (fills the frame, crops excess)
- **Dimensions**: `w_X,h_X` (width and height)
- **Gravity**: `g_center` (centers the crop)

#### Example Transformations:
```
Original: https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096578/c3_kamzog.jpg
With 80px: https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_80,h_80,g_center/v1759096578/c3_kamzog.jpg
With 400px: https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_400,h_400,g_center/v1759096578/c3_kamzog.jpg
```

### 2. Product Data Structure (`frontend/src/data/products.js`)

All products should have image data in one of these formats:

```javascript
{
  id: 1,
  name: "Product Name",
  slug: "product-slug",
  // Image can be:
  image: "https://res.cloudinary.com/...",  // Single image URL
  images: ["url1", "url2"],                  // Array of URLs
  gallery: ["url1", "url2"],                 // Array of URLs (alternative)
  // ... other product data
}
```

### 3. Cart System

#### Guest Cart (LocalStorage)
**Storage Key**: `capsule-cart`

**Data Structure**:
```javascript
[
  {
    id: 1,
    name: "Product Name",
    price: 299.00,
    quantity: 2,
    image: "https://res.cloudinary.com/...",  // Full product object stored
    // ... all other product properties
  }
]
```

**How it works**:
1. When user adds to cart (not logged in), entire product object is stored
2. Image property is preserved from original product data
3. Saved to localStorage on every cart change
4. Loaded from localStorage on page refresh

#### Authenticated User Cart (Backend)
**API Endpoint**: `GET /api/cart`

**Database Query** (`backend/src/models/CartModel.js`):
```sql
SELECT 
  ci.id,
  ci.product_id AS productId,
  ci.quantity,
  p.id, p.name, p.description, p.price, 
  p.image, p.images,  -- IMAGE DATA JOINED FROM PRODUCTS
  p.category, p.stock, p.slug, p.power_level, p.featured
FROM cart_items ci
LEFT JOIN products p ON ci.product_id = p.id
WHERE ci.user_id = ?
```

**Returned Structure**:
```javascript
{
  cart: [
    {
      id: 1,  // Product ID
      productId: 1,
      name: "Product Name",
      price: 299.00,
      quantity: 2,
      image: "https://res.cloudinary.com/...",  // From products JOIN
      images: ["url1", "url2"],
      // ... all product properties
    }
  ]
}
```

**Critical Fix Applied**: The backend now JOINs with the products table to include full product details (including images) instead of just returning cart_items data.

### 4. Image Display Components

#### Navbar Cart Dropdown (`frontend/src/components/Navbar/Navbar.jsx`)
```jsx
<img 
  src={resolveImageSrc(item, 80)} 
  alt={item.name} 
  className="w-12 h-12 object-cover rounded mr-2"
  onError={(e) => { e.target.src = '/assets/images/placeholder-80.png'; }}
/>
```

#### Checkout Order Summary (`frontend/src/pages/Checkout.jsx`)
```jsx
<img 
  src={resolveImageSrc(item, 300)}
  alt={item.name}
  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
  loading="lazy"
  onError={(e) => { e.target.src = '/assets/images/placeholder-300.png'; }}
/>
```

#### Cart Page (`frontend/src/pages/Cart.jsx`)
```jsx
<img 
  src={resolveImageSrc(item, 300)}
  alt={item.name}
  className="w-20 h-20 object-cover rounded-lg"
  loading="lazy"
/>
```

#### Product Cards, Carousels, etc.
All use the same `resolveImageSrc(product, size)` pattern.

### 5. Error Handling

#### Image Load Errors
All cart/product images include `onError` handlers:
```jsx
onError={(e) => { 
  e.target.src = '/assets/images/placeholder-80.png'; 
}}
```

#### Data Validation
- `CartContext.jsx` validates all product data before adding to cart
- Ensures product has `id`, `name`, and other required fields
- Defensive checks for quantity, price parsing

#### Fallback Placeholders
- `/assets/images/placeholder-80.png` (80x80px)
- `/assets/images/placeholder-300.png` (300x300px)

## Common Issues & Solutions

### Issue 1: Images not displaying in cart
**Cause**: Backend cart API was returning only `id`, `productId`, `quantity` without product details.

**Solution**: Modified `CartModel.getCart()` to JOIN with products table and return full product data including images.

### Issue 2: Duplicate Cloudinary transformations (404 errors)
**Cause**: `resolveImageSrc` was adding transformations to URLs that already had them.

**Solution**: Added regex check `img.match(/\/upload\/[^/]+\/)` to detect existing transformations and return URL as-is.

### Issue 3: Guest cart has images but authenticated cart doesn't
**Cause**: Guest cart stores full product objects in localStorage, but backend cart API wasn't including product details.

**Solution**: Fixed backend to JOIN with products table (see Issue 1).

### Issue 4: Different image sizes in different components
**Cause**: Components were hardcoding different pixel values or not using `resolveImageSrc` consistently.

**Solution**: Standardized on `resolveImageSrc(item, 80)` for thumbnails and `resolveImageSrc(item, 300)` for larger displays.

## Testing & Debugging

### Debug Tool
Access the cart debug tool at: `http://localhost:3000/debug-cart.html`

**Features**:
- View raw localStorage cart data
- Analyze each cart item's image properties
- Test image resolution for both 80px and 300px sizes
- Visual display of resolved images
- Identify missing image data

### Manual Testing Checklist

1. **Guest Cart**:
   - [ ] Add product to cart (not logged in)
   - [ ] Image shows in navbar cart dropdown
   - [ ] Image shows in cart page
   - [ ] Image shows in checkout
   - [ ] Refresh page - images persist

2. **Authenticated Cart**:
   - [ ] Log in
   - [ ] Add product to cart
   - [ ] Image shows in navbar cart dropdown
   - [ ] Image shows in cart page
   - [ ] Image shows in checkout
   - [ ] Log out and log back in - images persist

3. **Image Resolution**:
   - [ ] 80px thumbnails load in navbar
   - [ ] 400px images load in cart/checkout
   - [ ] Cloudinary transformations applied correctly
   - [ ] No 404 errors in network tab
   - [ ] Placeholders show for missing images

4. **Error Handling**:
   - [ ] Invalid image URL shows placeholder
   - [ ] Missing image property shows placeholder
   - [ ] Network error shows placeholder
   - [ ] No console errors

### Console Debugging

Add temporary debug logging to `CartContext.jsx`:
```javascript
useEffect(() => {
  console.log('🛒 Cart items:', cartItems);
  cartItems.forEach(item => {
    console.log(`Item ${item.id}:`, {
      name: item.name,
      image: item.image,
      images: item.images,
      resolved: resolveImageSrc(item, 80)
    });
  });
}, [cartItems]);
```

## Best Practices

1. **Always use `resolveImageSrc`**: Never hardcode image URLs in components
2. **Consistent sizing**: Use 80 for thumbnails, 300+ for larger displays
3. **Include error handlers**: Always add `onError` to `<img>` tags
4. **Preserve product data**: When storing cart items, store complete product objects
5. **JOIN product data**: Backend APIs should JOIN with products table to get images
6. **Validate URLs**: Check that resolved URLs are valid before rendering
7. **Lazy loading**: Use `loading="lazy"` for images below the fold
8. **Test both modes**: Always test guest cart AND authenticated cart

## File Reference

### Frontend Files
- `frontend/src/utils/images.js` - Image resolution logic
- `frontend/src/utils/imageDebug.js` - Debug utilities
- `frontend/src/contexts/CartContext.jsx` - Cart state management
- `frontend/src/components/Navbar/Navbar.jsx` - Cart dropdown
- `frontend/src/pages/Checkout.jsx` - Checkout page
- `frontend/src/pages/Cart.jsx` - Cart page
- `frontend/src/data/products.js` - Product data
- `frontend/public/debug-cart.html` - Debug tool

### Backend Files
- `backend/routes/cart.js` - Cart API endpoints
- `backend/src/models/CartModel.js` - Cart database queries
- `backend/src/models/ProductModel.js` - Product database queries

## Summary

The image handling system is designed to:
1. **Centralize** image resolution through a single function
2. **Optimize** images with Cloudinary transformations
3. **Handle** various data formats (strings, arrays, objects)
4. **Provide** fallbacks for missing/broken images
5. **Maintain** consistency between guest and authenticated carts
6. **Join** product data in backend APIs to include images

The recent fix ensuring the backend cart API includes full product data (including images) through database JOINs resolves the primary issue where authenticated users saw cart items without images.
