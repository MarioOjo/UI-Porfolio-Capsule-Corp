import { FaGoogle } from 'react-icons/fa';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { getAuthInstance, initFirebase } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

function GoogleSignInButton({ variant = 'primary', className = '' }) {
  const { signInWithGoogle, loading } = useGoogleAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const userData = await signInWithGoogle();
      if (userData) {
        navigate('/');
      }
    } catch (error) {
      // Error is already handled in the hook
      console.error('Google sign-in error:', error);
    }
  };

  const baseClasses = `
    w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl 
    font-saiyan font-bold text-lg transition-all duration-300 
    hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
    ${className}
  `;

  const variantClasses = {
    primary: `
      bg-white border-2 border-gray-300 text-gray-700 
      hover:border-red-500 hover:shadow-red-100 
      focus:outline-none focus:ring-2 focus:ring-red-500/20
    `,
    secondary: `
      bg-gradient-to-r from-red-500 to-red-600 text-white 
      border-2 border-red-500 hover:from-red-600 hover:to-red-700 
      focus:outline-none focus:ring-2 focus:ring-red-500/20
    `,
    outlined: `
      bg-transparent border-2 border-red-500 text-red-500 
      hover:bg-red-500 hover:text-white 
      focus:outline-none focus:ring-2 focus:ring-red-500/20
    `
  };

  // Initialize lazily so button reflects runtime env.json availability
  initFirebase();
  const auth = getAuthInstance();
  const disabled = loading || !auth;

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={disabled}
  title={!auth ? 'Firebase not configured locally' : undefined}
      className={`${baseClasses} ${variantClasses[variant]}`}
      type="button"
    >
      <FaGoogle className="text-xl" />
      {loading ? (
  <span className="flex items-center gap-2 p-2 sm:p-0">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          Connecting...
        </span>
      ) : (
        <span>Continue with Google</span>
      )}
    </button>
  );
}

export default GoogleSignInButton;