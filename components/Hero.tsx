import React from 'react';
import { SheetRow } from '../types';

interface HeroProps {
  data: SheetRow;
}

export const Hero: React.FC<HeroProps> = ({ data }) => {
  const bgImage = data.image || 'https://picsum.photos/1920/1080';

  return (
    <div className="relative bg-white dark:bg-gray-900 overflow-hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white dark:bg-gray-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 transition-colors duration-200">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white dark:text-gray-900 transform translate-x-1/2 transition-colors duration-200"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl transition-colors duration-200">
                <span className="block xl:inline">{data.title}</span>{' '}
                <span className="block text-indigo-600 dark:text-indigo-400 xl:inline">is here.</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 transition-colors duration-200">
                {data.subtitle}
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                {data.ctaText && (
                  <div className="rounded-md shadow">
                    <a
                      href={data.ctaLink || '#'}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 md:py-4 md:text-lg transition-colors"
                    >
                      {data.ctaText}
                    </a>
                  </div>
                )}
                {data.extra && (
                   <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a
                      href="#"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:bg-gray-800 dark:text-indigo-300 dark:hover:bg-gray-700 md:py-4 md:text-lg transition-colors"
                    >
                      {data.extra}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src={bgImage}
          alt={data.title}
        />
      </div>
    </div>
  );
};