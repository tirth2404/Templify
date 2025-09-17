import React from 'react';
import { useTemplate } from '../contexts/TemplateContext';
import { Search, Filter, Sparkles } from 'lucide-react';

const SearchAndFilter = () => {
  const { filters, categories, setFilters } = useTemplate();

  const handleSearchChange = (e) => {
    setFilters({ search: e.target.value });
  };

  const handleCategoryChange = (category) => {
    setFilters({ category });
  };

  const handleSortChange = (e) => {
    setFilters({ sortBy: e.target.value });
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0 lg:space-x-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search templates..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-gray-300"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                filters.category === category
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-gray-600">
            <Filter size={16} />
            <span className="text-sm font-medium">Sort by:</span>
          </div>
          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            className="border-2 border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-gray-300 bg-white"
          >
            <option value="popularity">Popularity</option>
            <option value="latest">Latest</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      {/* Active filters display */}
      {(filters.search || filters.category !== 'All') && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">Active filters:</span>
            {filters.search && (
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                Search: "{filters.search}"
              </span>
            )}
            {filters.category !== 'All' && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                Category: {filters.category}
              </span>
            )}
            <button
              onClick={() => setFilters({ search: '', category: 'All', sortBy: 'popularity' })}
              className="text-xs text-gray-500 hover:text-red-600 transition-colors"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;