import React from 'react';

interface BMSCELogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
}

const BMSCELogo: React.FC<BMSCELogoProps> = ({ 
  className = '', 
  size = 'md', 
  variant = 'full' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const icon = (
    <img
      src="/logo.png"
      alt="BMSCE Logo"
      className={`${sizeClasses[size]} ${className} object-contain`}
    />
  );

  const text = (
    <div className={`${textSizeClasses[size]} font-bold text-blue-600 ${className}`}>
      <div>B.M.S. College</div>
      <div>of Engineering</div>
    </div>
  );

  const fullLogo = (
    <div className={`flex items-center space-x-3 ${className}`}>
      {icon}
      <div className={`${textSizeClasses[size]} font-bold text-blue-600`}>
        <div>B.M.S. College</div>
        <div>of Engineering</div>
        <div className="text-xs text-blue-500 font-normal">AIML Department</div>
      </div>
    </div>
  );

  switch (variant) {
    case 'icon':
      return icon;
    case 'text':
      return text;
    case 'full':
    default:
      return fullLogo;
  }
};

export default BMSCELogo;
