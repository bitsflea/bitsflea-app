import React, { useState } from 'react';
import { Sparkles, ChevronDown } from 'lucide-react';
import { categories } from '../data/categories';

interface CategoryMenuProps {
  activeCategory: number | null;
  onCategoryChange: (category: number | null) => void;
}

export const CategoryMenu: React.FC<CategoryMenuProps> = ({ activeCategory, onCategoryChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const activeIcon = categories.find(cat => cat.value === activeCategory)?.icon || Sparkles;
  const Icon = activeIcon;

  return (
    <div className="w-full">
      {/* Mobile Dropdown */}
      <div className="md:hidden relative flex-1">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full h-[46px] flex items-center justify-between gap-2 bg-white rounded-lg px-4 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary-600" />
            <span className="font-medium text-gray-900">{activeCategory}</span>
          </div>
          <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
            {categories.map(({ name, icon: CategoryIcon, value }) => (
              <button
                key={name}
                onClick={() => {
                  onCategoryChange(value);
                  setIsDropdownOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 transition-colors ${activeCategory === value ? 'text-primary-600 bg-primary-50' : 'text-gray-700'
                  }`}
              >
                <CategoryIcon className="h-5 w-5" />
                <span>{name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Horizontal Menu */}
      <div className="hidden md:block overflow-x-auto pb-4 no-scrollbar">
        <div className="flex items-center gap-2 px-2">
          {categories.map(({ name, icon: CategoryIcon, value }) => {
            const isActive = activeCategory === value;
            return (
              <button
                key={name}
                onClick={() => onCategoryChange(value)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full
                  transition-all duration-300 ease-in-out
                  whitespace-nowrap font-medium flex-shrink-0
                  ${isActive
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 hover:bg-primary-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <CategoryIcon className={`h-5 w-5 ${isActive ? 'animate-pulse' : ''}`} />
                <span>{name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};