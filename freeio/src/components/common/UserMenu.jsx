import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function UserMenu() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <div className="d-flex align-items-center">
        <Link to="/login" className="login-info d-flex align-items-center">
          <i className="far fa-user-circle fz16 me-2" />
          <span className="d-none d-xl-block">Login / Register</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="user-menu position-relative" ref={menuRef}>
      <div 
        className="login-info d-flex align-items-center" 
        onClick={toggleMenu}
        style={{ cursor: 'pointer' }}
      >
        <div className="d-flex align-items-center">
          {user.profileImage ? (
            <img 
              src={user.profileImage} 
              alt={user.name} 
              className="rounded-circle me-2" 
              style={{ width: "30px", height: "30px", objectFit: "cover" }}
            />
          ) : (
            <i className="far fa-user-circle fz16 me-2" />
          )}
          <span className="d-none d-xl-block">{user.name}</span>
          <i className={`fas fa-chevron-down ms-2 fz14 ${isOpen ? 'fa-rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="dropdown-menu show position-absolute" style={{ minWidth: "200px", right: 0 }}>
          <div className="user-info p-3 border-bottom">
            <div className="fw-bold">{user.name}</div>
            <div className="text-muted small">{user.email}</div>
            <div className="badge bg-primary mt-1">{user.role}</div>
          </div>
          <Link to="/dashboard" className="dropdown-item">
            <i className="fas fa-tachometer-alt me-2"></i> Dashboard
          </Link>
          <Link to="/profile" className="dropdown-item">
            <i className="fas fa-user me-2"></i> Profile
          </Link>
          <Link to="/settings" className="dropdown-item">
            <i className="fas fa-cog me-2"></i> Settings
          </Link>
          <div className="dropdown-divider"></div>
          <button onClick={handleLogout} className="dropdown-item text-danger">
            <i className="fas fa-sign-out-alt me-2"></i> Logout
          </button>
        </div>
      )}
    </div>
  );
} 