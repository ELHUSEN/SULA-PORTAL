import React from 'react';
import { SheetRow } from '../types';

interface TestimonialsProps {
  items: SheetRow[];
}

export const Testimonials: React.FC<TestimonialsProps> = ({ items }) => {
  return (
    <section className="bg-indigo-800 dark:bg-indigo-900 py-12 px-4 sm:px-6 lg:px-8 lg:py-24 transition-colors duration-200">
      <div className="max-w-7xl mx-auto relative lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
        <div className="relative">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Trusted by the best
          </h2>
          <p className="mt-3 max-w-3xl text-lg text-indigo-200">
            See what our customers are saying about us. We pride ourselves on delivering quality and satisfaction.
          </p>
        </div>

        <div className="mt-8 lg:mt-0 relative lg:max-w-none">
            <div className="space-y-4">
                {items.map((item, idx) => (
                    <blockquote key={idx} className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-200">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="flex-shrink-0">
                                <img
                                    className="h-10 w-10 rounded-full bg-gray-300"
                                    src={item.image || `https://ui-avatars.com/api/?name=${item.title}&background=random`}
                                    alt=""
                                />
                            </div>
                            <div className="text-base font-medium text-gray-900 dark:text-white transition-colors duration-200">
                                {item.title}
                            </div>
                             {item.extra && <span className="text-sm text-gray-500 dark:text-gray-400">- {item.extra}</span>}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 italic transition-colors duration-200">"{item.subtitle}"</p>
                    </blockquote>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};