import { createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

// Create context
const AuthContext = createContext(null);

// Context provider component
export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const { 
    user, 
    token, 
    isAuthenticated, 
    isLoading, 
    error, 
    login, 
    register, 
    logout, 
    updateProfile 
  } = useAuthStore();

  // Handle token expiration
  useEffect(() => {
    if (token) {
      // Here you could implement token validation or refresh logic
      // For example, check if the token is expired and log out if it is
    }
  }, [token]);

  // Prepare the context value
  const contextValue = {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Protected route helper
export function withAuth(Component) {
  return function ProtectedRoute(props) {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        navigate('/login', { replace: true });
      }
    }, [isAuthenticated, isLoading, navigate]);
    
    if (isLoading) {
      return <div>Loading...</div>; // You can replace this with a spinner component
    }
    
    return isAuthenticated ? <Component {...props} /> : null;
  };
}

export default AuthContext; 