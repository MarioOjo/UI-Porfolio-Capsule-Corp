import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

const NotificationContext = createContext();

/**
 * Enhanced NotificationProvider with progress bars, queuing, 
 * positioning, and advanced features
 */
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [position, setPosition] = useState('top-right'); // top-right, top-left, bottom-right, bottom-left
  const [maxNotifications, setMaxNotifications] = useState(5);
  const timeoutRefs = useRef(new Map());

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
      timeoutRefs.current.clear();
    };
  }, []);

  // Add notification with enhanced options
  const addNotification = useCallback((notification) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const fullNotification = {
      id,
      type: 'info',
      duration: 3000,
      dismissible: true,
      persistent: false,
      position: 'top-right',
      action: null,
      onAction: null,
      onClose: null,
      ...notification
    };
    
    setNotifications(prev => {
      // Enforce max notifications limit
      const updated = [fullNotification, ...prev].slice(0, maxNotifications);
      return updated;
    });
    
    // Auto remove after duration if not persistent
    if (!fullNotification.persistent && fullNotification.duration > 0) {
      const timeout = setTimeout(() => {
        removeNotification(id);
        fullNotification.onClose?.();
      }, fullNotification.duration);
      
      timeoutRefs.current.set(id, timeout);
    }
    
    return id;
  }, [maxNotifications]);

  // Remove notification and cleanup
  const removeNotification = useCallback((id) => {
    // Clear timeout if exists
    if (timeoutRefs.current.has(id)) {
      clearTimeout(timeoutRefs.current.get(id));
      timeoutRefs.current.delete(id);
    }
    
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      notification?.onClose?.();
      return prev.filter(n => n.id !== id);
    });
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current.clear();
    setNotifications([]);
  }, []);

  // Pause all auto-dismiss timers
  const pauseAll = useCallback(() => {
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
  }, []);

  // Resume all auto-dismiss timers
  const resumeAll = useCallback(() => {
    notifications.forEach(notification => {
      if (!notification.persistent && notification.duration > 0 && !timeoutRefs.current.has(notification.id)) {
        const timeout = setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration);
        
        timeoutRefs.current.set(notification.id, timeout);
      }
    });
  }, [notifications, removeNotification]);

  // Notification methods
  const showSuccess = useCallback((message, options = {}) => {
    return addNotification({
      type: 'success',
      message,
      duration: options.duration || 3000,
      ...options
    });
  }, [addNotification]);

  const showError = useCallback((message, options = {}) => {
    return addNotification({
      type: 'error',
      message,
      duration: options.duration || 5000,
      ...options
    });
  }, [addNotification]);

  const showInfo = useCallback((message, options = {}) => {
    return addNotification({
      type: 'info',
      message,
      duration: options.duration || 3000,
      ...options
    });
  }, [addNotification]);

  const showWarning = useCallback((message, options = {}) => {
    return addNotification({
      type: 'warning',
      message,
      duration: options.duration || 4000,
      ...options
    });
  }, [addNotification]);

  const showLoading = useCallback((message, options = {}) => {
    return addNotification({
      type: 'loading',
      message,
      persistent: true,
      dismissible: false,
      ...options
    });
  }, [addNotification]);

  const updateNotification = useCallback((id, updates) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id 
        ? { ...notification, ...updates }
        : notification
    ));
  }, []);

  // Bulk operations
  const removeByType = useCallback((type) => {
    setNotifications(prev => prev.filter(n => n.type !== type));
  }, []);

  const removeByPosition = useCallback((position) => {
    setNotifications(prev => prev.filter(n => n.position !== position));
  }, []);

  // Notification component with progress bar
  const NotificationWithProgress = ({ notification, onClose, onAction }) => {
    const [progress, setProgress] = useState(100);
    const progressRef = useRef();

    useEffect(() => {
      if (notification.duration > 0 && !notification.persistent) {
        const startTime = Date.now();
        const totalDuration = notification.duration;
        
        const updateProgress = () => {
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, 100 - (elapsed / totalDuration) * 100);
          setProgress(remaining);
          
          if (remaining > 0) {
            progressRef.current = requestAnimationFrame(updateProgress);
          }
        };
        
        progressRef.current = requestAnimationFrame(updateProgress);
        
        return () => {
          if (progressRef.current) {
            cancelAnimationFrame(progressRef.current);
          }
        };
      }
    }, [notification.duration, notification.persistent]);

    const getNotificationStyles = (type) => {
      const baseStyles = "min-w-[320px] max-w-md p-4 rounded-xl shadow-2xl transform transition-all duration-300 ease-in-out border-l-4 backdrop-blur-sm ";
      
      const typeStyles = {
        success: "bg-green-50/95 text-green-800 border-green-500 dark:bg-green-900/95 dark:text-green-100",
        error: "bg-red-50/95 text-red-800 border-red-500 dark:bg-red-900/95 dark:text-red-100",
        info: "bg-blue-50/95 text-blue-800 border-blue-500 dark:bg-blue-900/95 dark:text-blue-100",
        warning: "bg-yellow-50/95 text-yellow-800 border-yellow-500 dark:bg-yellow-900/95 dark:text-yellow-100",
        loading: "bg-gray-50/95 text-gray-800 border-gray-500 dark:bg-gray-900/95 dark:text-gray-100"
      };
      
      return baseStyles + (typeStyles[type] || typeStyles.info);
    };

    const getIcon = (type) => {
      const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️',
        loading: '⏳'
      };
      return icons[type] || 'ℹ️';
    };

    const handleAction = () => {
      onAction?.(notification.id, notification.action);
      notification.onAction?.(notification.id, notification.action);
    };

    return (
      <div 
        className={getNotificationStyles(notification.type)}
        onMouseEnter={() => {
          if (progressRef.current) {
            cancelAnimationFrame(progressRef.current);
          }
        }}
        onMouseLeave={() => {
          if (notification.duration > 0 && !notification.persistent) {
            const startTime = Date.now();
            const totalDuration = notification.duration;
            const currentProgress = progress;
            
            const updateProgress = () => {
              const elapsed = Date.now() - startTime;
              const remaining = Math.max(0, currentProgress - (elapsed / totalDuration) * 100);
              setProgress(remaining);
              
              if (remaining > 0) {
                progressRef.current = requestAnimationFrame(updateProgress);
              }
            };
            
            progressRef.current = requestAnimationFrame(updateProgress);
          }
        }}
      >
        {/* Progress Bar */}
        {!notification.persistent && notification.duration > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-1 mb-3 dark:bg-gray-700">
            <div 
              className="h-1 rounded-full transition-all duration-100 ease-linear"
              style={{ 
                width: `${progress}%`,
                backgroundColor: notification.type === 'success' ? '#10B981' :
                               notification.type === 'error' ? '#EF4444' :
                               notification.type === 'warning' ? '#F59E0B' :
                               notification.type === 'loading' ? '#6B7280' : '#3B82F6'
              }}
            />
          </div>
        )}
        
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <span className="text-lg flex-shrink-0 mt-0.5">{getIcon(notification.type)}</span>
            <div className="flex-1 min-w-0">
              {notification.title && (
                <h4 className="font-bold text-sm mb-1">{notification.title}</h4>
              )}
              <p className="text-sm font-medium break-words leading-relaxed">
                {notification.message}
              </p>
              
              {/* Action Button */}
              {notification.action && (
                <button
                  onClick={handleAction}
                  className="mt-2 px-3 py-1 text-xs font-semibold rounded-lg bg-white/50 hover:bg-white/70 transition-colors border"
                >
                  {notification.action}
                </button>
              )}
            </div>
          </div>
          
          {notification.dismissible && (
            <button
              onClick={() => onClose(notification.id)}
              className="ml-3 text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded hover:bg-black/5"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    );
  };

  // Get container position styles
  const getContainerStyles = () => {
    const baseStyles = "fixed z-[9999] space-y-3 max-w-full p-4";
    
    const positionStyles = {
      'top-right': 'top-0 right-0',
      'top-left': 'top-0 left-0',
      'bottom-right': 'bottom-0 right-0',
      'bottom-left': 'bottom-0 left-0',
      'top-center': 'top-0 left-1/2 transform -translate-x-1/2',
      'bottom-center': 'bottom-0 left-1/2 transform -translate-x-1/2'
    };
    
    return `${baseStyles} ${positionStyles[position] || positionStyles['top-right']}`;
  };

  // Group notifications by position
  const notificationsByPosition = notifications.reduce((acc, notification) => {
    const pos = notification.position || position;
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(notification);
    return acc;
  }, {});

  const contextValue = {
    // State
    notifications,
    position,
    maxNotifications,
    
    // Core methods
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showLoading,
    addNotification,
    removeNotification,
    updateNotification,
    clearAllNotifications,
    
    // Bulk operations
    removeByType,
    removeByPosition,
    
    // Control methods
    pauseAll,
    resumeAll,
    
    // Configuration
    setPosition: (newPosition) => setPosition(newPosition),
    setMaxNotifications: (max) => setMaxNotifications(max),
    
    // Stats
    getNotificationCount: () => notifications.length,
    getNotificationCountByType: (type) => notifications.filter(n => n.type === type).length,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      
      {/* Notification Containers for each position */}
      {Object.entries(notificationsByPosition).map(([containerPosition, containerNotifications]) => (
        <div 
          key={containerPosition}
          className={getContainerStyles().replace(position, containerPosition)}
        >
          {containerNotifications.map(notification => (
            <NotificationWithProgress
              key={notification.id}
              notification={notification}
              onClose={removeNotification}
              onAction={(id, action) => {
                // Handle action callback
                notification.onAction?.(id, action);
              }}
            />
          ))}
        </div>
      ))}
    </NotificationContext.Provider>
  );
}

/**
 * Custom hook to use notification context
 */
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

/**
 * Hook for showing notifications with automatic success/error handling
 * @param {Function} asyncFn - Async function to execute
 * @param {Object} options - Notification options
 */
export function useAsyncNotifications() {
  const { showLoading, showSuccess, showError, removeNotification } = useNotifications();

  const executeWithNotifications = useCallback(async (
    asyncFn,
    options = {}
  ) => {
    const {
      loadingMessage = 'Processing...',
      successMessage = 'Operation completed successfully',
      errorMessage = 'Operation failed',
      showLoading: showLoadingNotification = true,
      showSuccess: showSuccessNotification = true,
      showError: showErrorNotification = true,
    } = options;

    let loadingId;

    try {
      if (showLoadingNotification) {
        loadingId = showLoading(loadingMessage, { persistent: true });
      }

      const result = await asyncFn();

      if (loadingId) {
        removeNotification(loadingId);
      }

      if (showSuccessNotification) {
        showSuccess(successMessage);
      }

      return result;
    } catch (error) {
      if (loadingId) {
        removeNotification(loadingId);
      }

      if (showErrorNotification) {
        showError(errorMessage || error.message);
      }

      throw error;
    }
  }, [showLoading, showSuccess, showError, removeNotification]);

  return { executeWithNotifications };
}

export default NotificationContext;