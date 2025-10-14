import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const showSuccess = useCallback((message, options = {}) => {
    const id = Date.now();
    const notification = {
      id,
      type: 'success',
      message,
      duration: options.duration || 3000,
      ...options
    };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto remove after duration
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, notification.duration);
  }, []);

  const showError = useCallback((message, options = {}) => {
    const id = Date.now();
    const notification = {
      id,
      type: 'error',
      message,
      duration: options.duration || 4000,
      ...options
    };
    
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, notification.duration);
  }, []);

  const showInfo = useCallback((message, options = {}) => {
    const id = Date.now();
    const notification = {
      id,
      type: 'info',
      message,
      duration: options.duration || 3000,
      ...options
    };
    
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, notification.duration);
  }, []);

  const showWarning = useCallback((message, options = {}) => {
    const id = Date.now();
    const notification = {
      id,
      type: 'warning',
      message,
      duration: options.duration || 3500,
      ...options
    };
    
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, notification.duration);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ 
      notifications,
      showSuccess, 
      showError, 
      showInfo, 
      showWarning,
      removeNotification 
    }}>
      {children}
      
      {/* Notification Container */}
      <div className="fixed top-4 right-4 z-[9999] space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`
              min-w-[300px] max-w-md p-4 rounded-lg shadow-2xl
              transform transition-all duration-300 ease-in-out
              animate-slide-in-right
              ${notification.type === 'success' ? 'bg-green-500 text-white' : ''}
              ${notification.type === 'error' ? 'bg-red-500 text-white' : ''}
              ${notification.type === 'info' ? 'bg-blue-500 text-white' : ''}
              ${notification.type === 'warning' ? 'bg-yellow-500 text-white' : ''}
            `}
          >
            <div className="flex items-start justify-between">
              <p className="flex-1 font-medium">{notification.message}</p>
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-3 text-white hover:text-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
