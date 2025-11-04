# Capsule Corp Logo - Isolated Styles

This directory contains the isolated CSS and component for the Capsule Corp logo.

## Files

- **`CapsuleCorpLogo.css`** - Isolated CSS styles for the logo
- **`CapsuleLogo.jsx`** - Reusable React component

## Usage

### Option 1: Using the React Component (Recommended)

Import and use the component directly:

```jsx
import CapsuleLogo from './components/CapsuleLogo';

// Basic usage (white text, medium size)
<CapsuleLogo />

// With custom props
<CapsuleLogo 
  variant="blue"     // 'white' or 'blue'
  size="lg"          // 'sm', 'md', or 'lg'
  glow={true}        // Enable glow effect
  pulse={false}      // Enable pulse animation
  to="/home"         // Custom link destination
/>
```

### Option 2: Using CSS Classes Directly

Import the CSS file and use the classes:

```jsx
import './components/CapsuleCorpLogo.css';

<Link to="/" className="capsule-logo-container">
  <div className="capsule-logo-icon">
    <FaCapsules />
  </div>
  <h1 className="capsule-logo-text">CAPSULE CORP.</h1>
</Link>
```

## CSS Classes

### Core Classes

- `.capsule-logo-container` - Main container with flex layout
- `.capsule-logo-icon` - Golden gradient circle with capsule icon
- `.capsule-logo-text` - White text for dark backgrounds
- `.capsule-logo-text-blue` - Blue text for light backgrounds

### Modifier Classes

- `.glow` - Adds glowing effect to the icon
- `.animate-pulse` - Adds pulsing animation to the icon

## Customization

### Colors

The logo uses these default colors:
- **Icon gradient**: `#FF9E00` (accent) to `#FF9E00` (orange)
- **Icon color**: `#3B4CCA` (capsule blue)
- **Text (white variant)**: `white` with gold hover
- **Text (blue variant)**: `#3B4CCA` with orange hover

### Sizes

Predefined size variants in the component:
- **sm**: 32px icon, text-lg
- **md**: 48px icon, text-2xl (default)
- **lg**: 64px icon, text-3xl

### Responsive Breakpoints

- **Mobile (< 480px)**: Smaller icon and text
- **Tablet (< 640px)**: Medium icon and text
- **Desktop (≥ 640px)**: Full size

## Examples

### HomeHeader (gradient background)
```jsx
<CapsuleLogo variant="white" size="md" />
```

### Navbar (light background)
```jsx
<CapsuleLogo variant="blue" size="md" />
```

### Footer (with glow)
```jsx
<CapsuleLogo variant="white" size="sm" glow={true} />
```

### Landing page (large with pulse)
```jsx
<CapsuleLogo variant="white" size="lg" pulse={true} />
```

## Integration with Existing Components

To replace existing logo code in your components:

### In HomeHeader.jsx
Replace this:
```jsx
<Link to="/" className="flex items-center space-x-3">
  <div className="w-12 h-12 bg-gradient-to-br from-capsule-accent to-capsule-orange rounded-full flex items-center justify-center shadow-lg border-2 border-white">
    <FaCapsules className="text-[#3B4CCA] text-xl" />
  </div>
  <h1 className="text-2xl font-bold text-white font-saiyan">CAPSULE CORP.</h1>
</Link>
```

With this:
```jsx
<CapsuleLogo variant="white" size="md" />
```

### In Navbar.jsx
Replace this:
```jsx
<Link to="/" className="flex items-center space-x-3">
  <div className="w-12 h-12 bg-gradient-to-br from-capsule-accent to-capsule-orange rounded-full flex items-center justify-center shadow-lg border-2 border-white">
    <FaCapsules className="text-[#3B4CCA] text-xl" />
  </div>
  <h1 className="text-2xl font-bold text-[#3B4CCA] font-saiyan">CAPSULE CORP.</h1>
</Link>
```

With this:
```jsx
<CapsuleLogo variant="blue" size="md" />
```

## Benefits of Isolated Styles

1. **Reusability** - Use the same logo across all components
2. **Consistency** - Centralized styling ensures uniform appearance
3. **Maintainability** - Update logo once, changes reflect everywhere
4. **Performance** - Single CSS file, no duplicate styles
5. **Flexibility** - Easy to customize with props or CSS variables

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid & Flexbox support required
- CSS animations supported
