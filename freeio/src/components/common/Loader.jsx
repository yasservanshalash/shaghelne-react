import React from 'react';

const Loader = ({ size = 'medium', color = 'primary' }) => {
  // Set size classes based on the size prop
  const sizeClass = 
    size === 'small' ? 'spinner-border-sm' :
    size === 'large' ? 'spinner-border-lg' :
    '';
  
  // Set color classes based on the color prop
  const colorClass =
    color === 'secondary' ? 'text-secondary' :
    color === 'success' ? 'text-success' :
    color === 'danger' ? 'text-danger' :
    color === 'warning' ? 'text-warning' :
    color === 'info' ? 'text-info' :
    color === 'light' ? 'text-light' :
    color === 'dark' ? 'text-dark' :
    'text-primary';

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div 
        className={`spinner-border ${sizeClass} ${colorClass}`} 
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loader; 