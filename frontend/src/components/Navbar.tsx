import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bot, Users, BookOpen, Calendar, Building2, Info, Moon, Sun, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import BMSCELogo from './BMSCELogo.tsx';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Bot },
    { name: 'Chat', href: '/chat', icon: Bot },
    { name: 'Faculty', href: '/faculty', icon: Users },
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Infrastructure', href: '/infrastructure', icon: Building2 },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Admin', href: '/admin', icon: Shield },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 shadow-lg transition-colors duration-300 ${
        darkMode 
          ? 'bg-gray-800 border-b border-gray-700' 
          : 'bg-white border-b border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <Link to="/" className="flex items-center space-x-3 group">
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <BMSCELogo 
                          size="md" 
                          variant="icon"
                          className="transition-colors duration-300"
                        />
                      </motion.div>
                      <div className="flex flex-col">
                        <span className={`text-lg font-bold transition-colors duration-300 ${
                          darkMode ? 'text-white' : 'text-blue-600'
                        }`}>
                          AIML Department
                        </span>
                        <span className={`text-xs transition-colors duration-300 ${
                          darkMode ? 'text-gray-300' : 'text-blue-500'
                        }`}>
                          AI Assistant
                        </span>
                      </div>
                    </Link>
                  </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? darkMode 
                          ? 'bg-blue-900 text-blue-300' 
                          : 'bg-blue-100 text-blue-700'
                        : darkMode
                          ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-700'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                </motion.div>
              );
            })}
            
            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${
                darkMode
                  ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-700'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
              }`}
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden"
        >
          <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? darkMode
                          ? 'bg-blue-900 text-blue-300'
                          : 'bg-blue-100 text-blue-700'
                        : darkMode
                          ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-700'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
