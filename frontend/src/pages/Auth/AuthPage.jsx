import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import Login from './Login';
import Signup from './Signup';
import './Auth.css';

function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'login');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Update tab when URL param changes
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'signup' || tab === 'login') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/auth?tab=${tab}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Tab Navigation */}
        <div className="bg-white rounded-t-2xl shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-4 px-6 font-saiyan text-sm font-bold transition-all duration-300 ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-[#3B4CCA] to-blue-600 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              LOGIN
            </button>
            <button
              onClick={() => handleTabChange('signup')}
              className={`flex-1 py-4 px-6 font-saiyan text-sm font-bold transition-all duration-300 ${
                activeTab === 'signup'
                  ? 'bg-gradient-to-r from-[#3B4CCA] to-blue-600 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              REGISTER
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-2xl shadow-lg p-8">
          {activeTab === 'login' ? <Login /> : <Signup />}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            © {new Date().getFullYear()} Capsule Corporation. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
