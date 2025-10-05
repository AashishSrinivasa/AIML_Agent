import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Cpu, Zap, Sparkles } from 'lucide-react';

interface BMSCELogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text' | 'creative';
}

const BMSCELogo: React.FC<BMSCELogoProps> = ({ 
  className = '', 
  size = 'md', 
  variant = 'creative' 
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

  const creativeLogo = (
    <motion.div 
      className={`flex items-center space-x-3 ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {/* AI/ML Themed Icon */}
      <div className="relative">
        <motion.div
          className={`${sizeClasses[size]} bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden`}
          animate={{ 
            boxShadow: [
              "0 0 20px rgba(168, 85, 247, 0.4)",
              "0 0 30px rgba(236, 72, 153, 0.6)",
              "0 0 20px rgba(168, 85, 247, 0.4)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* BMSCE Logo with background */}
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <img 
              src="/logo.png" 
              alt="BMSCE Logo" 
              className="w-14 h-14 object-contain"
            />
          </div>
        </motion.div>
        
        {/* Floating Elements */}
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Sparkles className="w-2 h-2 text-white" />
        </motion.div>
        
        <motion.div
          className="absolute -bottom-1 -left-1 w-3 h-3 bg-green-400 rounded-full"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </div>

      {/* Department Text */}
      <div className={`${textSizeClasses[size]} font-bold`}>
        <motion.div 
          className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          AIML Department
        </motion.div>
        <motion.div 
          className="text-xs text-gray-600 font-normal flex items-center space-x-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Cpu className="w-3 h-3" />
          <span>AI & Machine Learning</span>
        </motion.div>
        <motion.div 
          className="text-xs text-blue-500 font-normal flex items-center space-x-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Zap className="w-3 h-3" />
          <span>Powered by LIAM</span>
        </motion.div>
      </div>
    </motion.div>
  );

  switch (variant) {
    case 'icon':
      return icon;
    case 'text':
      return text;
    case 'full':
      return fullLogo;
    case 'creative':
    default:
      return creativeLogo;
  }
};

export default BMSCELogo;
