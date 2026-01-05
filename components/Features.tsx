import React from 'react';
import { SheetRow } from '../types';
import { CheckCircle, Zap, Star, Shield } from 'lucide-react';

interface FeaturesProps {
  items: SheetRow[];
}

const ICONS = [Zap, Shield, Star, CheckCircle];

export const Features: React.FC<FeaturesProps> = ({ items }) => {
  return (
    <div className="py-12 bg-white dark:bg-gray-900 transition-colors duration-200" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase transition-colors">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl transition-colors">
            Everything you need
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto transition-colors">
            Explore what makes us unique.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {items.map((item, idx) => {
              const Icon = ICONS[idx % ICONS.length];
              return (
                <div key={idx} className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                        {item.image ? (
                            <img src={item.image} alt="" className="h-8 w-8 object-contain filter invert brightness-0" />
                        ) : (
                             <Icon className="h-6 w-6" aria-hidden="true" />
                        )}
                     
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white transition-colors">{item.title}</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400 transition-colors">{item.subtitle}</dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </div>
  );
};