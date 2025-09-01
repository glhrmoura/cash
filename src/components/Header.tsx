import React from 'react';
import UserProfile from '@/components/UserProfile';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg overflow-hidden">
              <img 
                src="/icons/icon-128x128.png" 
                alt="Cash Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Cash
              </h1>
              <p className="text-xs text-muted-foreground">
                Controle de Gastos
              </p>
            </div>
          </div>
          <UserProfile />
        </div>
      </div>
    </header>
  );
};

export default Header;
