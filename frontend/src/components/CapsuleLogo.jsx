import { Link } from 'react-router-dom';
import { FaCapsules } from 'react-icons/fa';
import './CapsuleCorpLogo.css';

/**
 * Capsule Corp Logo Component
 * 
 * A reusable logo component with icon and text
 * 
 * @param {Object} props
 * @param {string} props.variant - Color variant: 'white' (for dark backgrounds) or 'blue' (for light backgrounds)
 * @param {string} props.size - Size variant: 'sm', 'md', 'lg'
 * @param {boolean} props.glow - Enable glow effect
 * @param {boolean} props.pulse - Enable pulse animation
 * @param {string} props.to - Link destination (default: '/')
 */
function CapsuleCorpLogo({ 
  variant = 'white', 
  size = 'md',
  glow = false,
  pulse = false,
  to = '/'
}) {
  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'gap-2',
      icon: 'w-8 h-8',
      iconText: 'text-sm',
      text: 'text-lg'
    },
    md: {
      container: 'gap-3',
      icon: 'w-12 h-12',
      iconText: 'text-xl',
      text: 'text-2xl'
    },
    lg: {
      container: 'gap-4',
      icon: 'w-16 h-16',
      iconText: 'text-2xl',
      text: 'text-3xl'
    }
  };

  const config = sizeConfig[size] || sizeConfig.md;
  const iconClasses = `capsule-logo-icon ${config.icon} ${glow ? 'glow' : ''} ${pulse ? 'animate-pulse' : ''}`;
  const textClasses = variant === 'blue' ? 'capsule-logo-text-blue' : 'capsule-logo-text';

  return (
    <Link to={to} className={`capsule-logo-container ${config.container}`}>
      <div className={iconClasses}>
        <FaCapsules className={config.iconText} />
      </div>
      <h1 className={`${textClasses} ${config.text}`}>
        CAPSULE CORP.
      </h1>
    </Link>
  );
}

export default CapsuleCorpLogo;
