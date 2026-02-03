// ============================================
// REUSABLE MODAL COMPONENT
// Demonstrates: Reusability, Portal pattern concept
// ============================================

import React from 'react';

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '0',
    minWidth: '400px',
    maxWidth: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #e5e7eb',
  };

  const titleStyle = {
    margin: 0,
    fontSize: '18px',
    fontWeight: 600,
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '0',
    lineHeight: 1,
  };

  const bodyStyle = {
    padding: '20px',
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div style={overlayStyle} onClick={handleOverlayClick}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>{title}</h2>
          <button style={closeButtonStyle} onClick={onClose}>
            ×
          </button>
        </div>
        <div style={bodyStyle}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
