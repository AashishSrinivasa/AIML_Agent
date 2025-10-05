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
      {/* Outer Gear Frame */}
      <g transform="translate(50, 50)">
        {/* Gear teeth */}
        {Array.from({ length: 16 }, (_, i) => (
          <rect
            key={i}
            x="-1"
            y="-48"
            width="2"
            height="8"
            fill="#1a1a1a"
            transform={`rotate(${i * 22.5} 0 0)`}
          />
        ))}
      </g>
      
      {/* Inner Black Circle with Text */}
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="#1a1a1a"
      />
      
      {/* Text around the circle - Bright Blue */}
      <text
        x="50"
        y="35"
        textAnchor="middle"
        className="fill-blue-400 font-bold"
        fontSize="6"
        fontWeight="bold"
      >
        B.M.S. COLLEGE OF ENGINEERING
      </text>
      <text
        x="50"
        y="65"
        textAnchor="middle"
        className="fill-blue-400 font-bold"
        fontSize="5"
        fontWeight="bold"
      >
        BANGALORE - 560019
      </text>
      
      {/* Red dots as separators */}
      <circle cx="25" cy="50" r="1.5" fill="#dc2626" />
      <circle cx="75" cy="50" r="1.5" fill="#dc2626" />
      <circle cx="50" y="60" r="1" fill="white" />
      
      {/* Central Blue Circle - Divided into sky and water */}
      <defs>
        <linearGradient id="skyWater" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="50%" stopColor="#1e40af" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="25"
        fill="url(#skyWater)"
      />
      
      {/* Bridge */}
      <g transform="translate(50, 50)">
        {/* Bridge towers */}
        <rect x="-8" y="-5" width="3" height="8" fill="#1e3a8a" />
        <rect x="5" y="-5" width="3" height="8" fill="#1e3a8a" />
        
        {/* Bridge deck */}
        <rect x="-10" y="3" width="20" height="2" fill="#1e3a8a" />
        
        {/* Suspension cables */}
        <path d="M-8,-5 Q0,-2 8,-5" stroke="#1e3a8a" strokeWidth="0.5" fill="none" />
        <path d="M-8,-3 Q0,0 8,-3" stroke="#1e3a8a" strokeWidth="0.5" fill="none" />
        <path d="M-8,-1 Q0,2 8,-1" stroke="#1e3a8a" strokeWidth="0.5" fill="none" />
        
        {/* Water ripples */}
        <rect x="-12" y="8" width="24" height="0.5" fill="#93c5fd" />
        <rect x="-12" y="9" width="24" height="0.5" fill="#93c5fd" />
        <rect x="-12" y="10" width="24" height="0.5" fill="#93c5fd" />
        <rect x="-12" y="11" width="24" height="0.5" fill="#93c5fd" />
      </g>
      
      {/* Red Lightning Bolt with White Outline */}
      <g transform="translate(50, 50)">
        <path
          d="M-15,10 L-5,-5 L0,0 L5,-10 L15,5 L10,10 L5,5 L0,0 L-5,15 Z"
          fill="#dc2626"
          stroke="white"
          strokeWidth="0.5"
        />
      </g>
      
      {/* ESTD. 1946 Text */}
      <text
        x="50"
        y="42"
        textAnchor="middle"
        className="fill-white font-bold"
        fontSize="4"
        fontWeight="bold"
      >
        ESTD. 1946
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
