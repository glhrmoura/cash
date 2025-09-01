import React from 'react';

interface ThreeDotsLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ThreeDotsLoader: React.FC<ThreeDotsLoaderProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      <div
        className={`${dotSizeClasses[size]} bg-current rounded-full animate-bounce`}
        style={{ animationDelay: '0ms' }}
      />
      <div
        className={`${dotSizeClasses[size]} bg-current rounded-full animate-bounce`}
        style={{ animationDelay: '150ms' }}
      />
      <div
        className={`${dotSizeClasses[size]} bg-current rounded-full animate-bounce`}
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );
};

export default ThreeDotsLoader;
