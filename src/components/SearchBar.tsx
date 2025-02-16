import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch?: (query: string) => void
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery)
    }
  };

  const handleMobileSearchToggle = () => {
    setShowMobileSearch(!showMobileSearch);
    if (!showMobileSearch) {
      setTimeout(() => {
        const input = document.getElementById('mobile-search-input');
        input?.focus();
      }, 100);
    }
  };

  return (
    <>
      {/* Desktop Search */}
      <div className="hidden md:block w-full mb-4">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-3 pl-12 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 shadow-sm"
            />
            <Search className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          </div>
        </form>
      </div>

      {/* Mobile Search Button */}
      <div className="md:hidden">
        <button
          onClick={handleMobileSearchToggle}
          className="h-[46px] px-4 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center"
        >
          <Search className="h-5 w-5 text-gray-600" />
        </button>

        {/* Mobile Search Dropdown */}
        <div
          className={`fixed left-0 right-0 bg-white z-50 transition-all duration-300 shadow-lg ${showMobileSearch ? 'top-[64px]' : '-top-full'
            }`}
        >
          <form onSubmit={handleSearch} className="p-4">
            <div className="relative">
              <input
                id="mobile-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-3 pl-12 pr-12 rounded-lg border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <button
                type="button"
                onClick={handleMobileSearchToggle}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};