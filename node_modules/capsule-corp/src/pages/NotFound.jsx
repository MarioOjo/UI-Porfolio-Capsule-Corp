import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-orange-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-orange-500 font-saiyan mb-4 animate-pulse">
            404
          </div>
          <div className="relative">
            <div className="text-6xl mb-4">🐉</div>
            <div className="absolute inset-0 text-6xl animate-bounce">💨</div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white font-saiyan mb-4">
            PAGE NOT FOUND!
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Looks like this page was destroyed by a Kamehameha wave!
          </p>
          <p className="text-gray-400">
            The page you're looking for doesn't exist in any timeline.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 max-w-sm mx-auto">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 font-saiyan text-lg shadow-lg hover:shadow-orange-500/25"
          >
            🏠 RETURN TO CAPSULE CORP
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 font-saiyan text-lg shadow-lg hover:shadow-blue-500/25"
          >
            ⬅️ GO BACK
          </button>

          <button
            onClick={() => navigate('/products')}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 font-saiyan text-lg shadow-lg hover:shadow-purple-500/25"
          >
            🛍️ BROWSE PRODUCTS
          </button>
        </div>

        {/* Easter Egg */}
        <div className="mt-12 text-gray-500 text-sm">
          <p>"It's over 9000!" - Vegeta, probably about this error code</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;