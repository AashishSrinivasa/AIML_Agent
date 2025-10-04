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
    <svg
      className={`${sizeClasses[size]} ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Circle */}
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="#1e40af"
        strokeWidth="2"
      />
      
      {/* Inner Circle */}
      <circle
        cx="50"
        cy="50"
        r="35"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="1.5"
      />
      
      {/* Central Symbol - Engineering Gear */}
      <g transform="translate(50, 50)">
        {/* Main gear */}
        <circle
          cx="0"
          cy="0"
          r="15"
          fill="#1e40af"
        />
        <circle
          cx="0"
          cy="0"
          r="8"
          fill="white"
        />
        
        {/* Gear teeth */}
        {Array.from({ length: 8 }, (_, i) => (
          <rect
            key={i}
            x="-1"
            y="-20"
            width="2"
            height="6"
            fill="#1e40af"
            transform={`rotate(${i * 45} 0 0)`}
          />
        ))}
        
        {/* Inner details */}
        <circle
          cx="0"
          cy="0"
          r="3"
          fill="#1e40af"
        />
      </g>
      
      {/* Text around the circle */}
      <text
        x="50"
        y="25"
        textAnchor="middle"
        className="fill-blue-600 font-bold text-xs"
        fontSize="8"
      >
        B.M.S. COLLEGE
      </text>
      <text
        x="50"
        y="35"
        textAnchor="middle"
        className="fill-blue-600 font-bold text-xs"
        fontSize="8"
      >
        OF ENGINEERING
      </text>
      <text
        x="50"
        y="75"
        textAnchor="middle"
        className="fill-blue-800 font-semibold text-xs"
        fontSize="6"
      >
        EST. 1946
      </text>
    </svg>
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
