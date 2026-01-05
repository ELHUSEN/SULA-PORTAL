import React from 'react';
import { SheetRow } from '../types';
import { Check } from 'lucide-react';

interface PricingProps {
  items: SheetRow[];
}

export const Pricing: React.FC<PricingProps> = ({ items }) => {
  return (
    <div className="bg-gray-900 dark:bg-black transition-colors duration-200" id="pricing">
      <div className="pt-12 sm:pt-16 lg:pt-24">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-2 lg:max-w-none">
            <h2 className="text-lg leading-6 font-semibold text-gray-300 uppercase tracking-wider">Pricing</h2>
            <p className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              The right price for you
            </p>
            <p className="text-xl text-gray-400">
              Simple, transparent pricing.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8 pb-12 bg-gray-50 dark:bg-gray-900 sm:mt-12 sm:pb-16 lg:mt-16 lg:pb-24 transition-colors duration-200">
        <div className="relative">
          <div className="absolute inset-0 h-3/4 bg-gray-900 dark:bg-black transition-colors duration-200" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto space-y-4 lg:max-w-5xl lg:grid lg:grid-cols-3 lg:gap-5 lg:space-y-0">
              {items.map((item, idx) => (
                <div key={idx} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                  <div className="px-6 py-8 bg-white dark:bg-gray-800 sm:p-10 sm:pb-6 transition-colors duration-200">
                    <div>
                      <h3
                        className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200"
                        id="tier-standard"
                      >
                        {item.title}
                      </h3>
                    </div>
                    <div className="mt-4 flex items-baseline text-6xl font-extrabold text-gray-900 dark:text-white transition-colors duration-200">
                      {item.extra || '$0'}
                      <span className="ml-1 text-2xl font-medium text-gray-500 dark:text-gray-400">/mo</span>
                    </div>
                    <p className="mt-5 text-lg text-gray-500 dark:text-gray-300 transition-colors duration-200">{item.subtitle}</p>
                  </div>
                  <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 dark:bg-gray-700 space-y-6 sm:p-10 sm:pt-6 transition-colors duration-200">
                    <ul className="space-y-4">
                        {/* Mocking features from description if needed, or just static checks */}
                        <li className="flex items-start">
                          <div className="flex-shrink-0">
                            <Check className="h-6 w-6 text-green-500" aria-hidden="true" />
                          </div>
                          <p className="ml-3 text-base text-gray-700 dark:text-gray-200">All features included</p>
                        </li>
                         <li className="flex items-start">
                          <div className="flex-shrink-0">
                            <Check className="h-6 w-6 text-green-500" aria-hidden="true" />
                          </div>
                          <p className="ml-3 text-base text-gray-700 dark:text-gray-200">24/7 Support</p>
                        </li>
                    </ul>
                    <div className="rounded-md shadow">
                      <a
                        href={item.ctaLink || '#'}
                        className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 dark:bg-gray-900 dark:hover:bg-black transition-colors"
                        aria-describedby="tier-standard"
                      >
                        {item.ctaText || 'Get started'}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};