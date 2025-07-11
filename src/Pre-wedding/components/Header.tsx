import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 text-center mb-5">
      <h1 
        className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 shadow-sm"
        style={{ 
          fontFamily: 'Georgia, serif',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)' 
        }}
      >
        Famiory
      </h1>
    </header>
  );
};

export default Header;