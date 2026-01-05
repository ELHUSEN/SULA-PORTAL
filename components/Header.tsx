import React from 'react';
import { Menu, Moon, Sun, Wand2 } from 'lucide-react';

interface HeaderProps {
    title?: string;
    logo?: string;
    darkMode?: boolean;
    toggleDarkMode?: () => void;
    onNewsClick?: () => void;
    onGeneratorClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = "PORTAL SATU DATA SULA", 
  logo,
  darkMode = false, 
  toggleDarkMode,
  onNewsClick,
  onGeneratorClick
}) => {
  return (
    <div className="relative bg-white dark:bg-gray-900 shadow transition-colors duration-200 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <a href="#" className="flex items-center gap-3">
              {logo && (
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="h-10 w-auto object-contain"
                />
              )}
              <span className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {title}
              </span>
            </a>
          </div>
          
          <div className="-mr-2 -my-2 md:hidden flex items-center gap-4">
             {toggleDarkMode && (
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                </button>
            )}
            <button type="button" className="bg-white dark:bg-gray-800 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="sr-only">Open menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <nav className="hidden md:flex space-x-10 items-center">
            <a href="#" className="text-base font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
              DASHBOARD
            </a>
            <button 
              onClick={onGeneratorClick}
              className="flex items-center gap-2 text-base font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors focus:outline-none"
            >
              <Wand2 className="w-4 h-4" />
              ART GEN
            </button>
            <button 
              onClick={onNewsClick}
              className="text-base font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors focus:outline-none"
            >
              NEWS UPDATE
            </button>
          </nav>
          
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
             {toggleDarkMode && (
                <button
                  onClick={toggleDarkMode}
                  className="mr-6 p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
            )}
            <a href="#" className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
              Sign in
            </a>
            <a href="#" className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
