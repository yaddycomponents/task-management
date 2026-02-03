// ============================================
// COMPOUND COMPONENT PATTERN: Card
// Usage:
//   <Card>
//     <Card.Header>Title</Card.Header>
//     <Card.Body>Content</Card.Body>
//     <Card.Footer>Actions</Card.Footer>
//   </Card>
// ============================================

import React, { createContext, useContext } from 'react';

const CardContext = createContext({});

const useCardContext = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('Card components must be used within a Card');
  }
  return context;
};

// Main Card component
const Card = ({ children, variant = 'default', style = {} }) => {
  const variants = {
    default: { backgroundColor: 'white', border: '1px solid #e5e7eb' },
    elevated: { backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
    outlined: { backgroundColor: 'transparent', border: '2px solid #3b82f6' },
  };

  const cardStyle = {
    borderRadius: '8px',
    overflow: 'hidden',
    ...variants[variant],
    ...style,
  };

  return (
    <CardContext.Provider value={{ variant }}>
      <div style={cardStyle}>{children}</div>
    </CardContext.Provider>
  );
};

// Card.Header sub-component
const Header = ({ children, style = {} }) => {
  useCardContext();

  const headerStyle = {
    padding: '16px',
    borderBottom: '1px solid #e5e7eb',
    fontWeight: 600,
    fontSize: '16px',
    ...style,
  };

  return <div style={headerStyle}>{children}</div>;
};

// Card.Body sub-component
const Body = ({ children, style = {} }) => {
  useCardContext();

  const bodyStyle = {
    padding: '16px',
    ...style,
  };

  return <div style={bodyStyle}>{children}</div>;
};

// Card.Footer sub-component
const Footer = ({ children, style = {} }) => {
  useCardContext();

  const footerStyle = {
    padding: '12px 16px',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
    ...style,
  };

  return <div style={footerStyle}>{children}</div>;
};

// Attach sub-components to Card
Card.Header = Header;
Card.Body = Body;
Card.Footer = Footer;

export { Card };
export default Card;
