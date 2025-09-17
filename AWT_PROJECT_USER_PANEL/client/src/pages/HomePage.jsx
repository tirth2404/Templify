import React, { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTemplate } from '../contexts/TemplateContext';
import SearchAndFilter from '../components/SearchAndFilter';
import TemplateCard from '../components/TemplateCard';
import { TrendingUp, Star, Calendar, Palette, Sparkles, Users, Clock } from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();
  const { getFilteredTemplates, templates } = useTemplate();
  
  // Memoized template filtering for better performance
  const filteredTemplates = useMemo(() => getFilteredTemplates(), [getFilteredTemplates]);
  const trendingTemplates = useMemo(() => templates.filter(t => t.trending), [templates]);
  const latestTemplates = useMemo(() => templates.filter(t => t.latest), [templates]);

  // Memoized stats for better performance
  const stats = useMemo(() => ({
    total: templates.length,
    trending: trendingTemplates.length,
    latest: latestTemplates.length,
    popular: templates.length
  }), [templates, trendingTemplates.length, latestTemplates.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <Sparkles className="text-white h-6 w-6" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Welcome back, {user?.companyName || user?.email}!
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Create stunning designs for your business with our professional templates
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Templates</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Trending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.trending}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Latest</p>
                <p className="text-2xl font-bold text-gray-900">{stats.latest}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Popular</p>
                <p className="text-2xl font-bold text-gray-900">{stats.popular}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <SearchAndFilter />

        {/* Trending Templates Section */}
        {trendingTemplates.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-8">
              <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg mr-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Trending Templates</h2>
                <p className="text-gray-600 mt-1">Most popular designs this week</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {trendingTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </div>
        )}

        {/* Latest Templates Section */}
        {latestTemplates.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-8">
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg mr-4">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Latest Templates</h2>
                <p className="text-gray-600 mt-1">Fresh designs just added</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {latestTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </div>
        )}

        {/* All Templates */}
        <div>
          <div className="flex items-center mb-8">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg mr-4">
              <Palette className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {filteredTemplates.length === templates.length ? 'All Templates' : 'Search Results'}
              </h2>
              <p className="text-gray-600 mt-1">
                {filteredTemplates.length === templates.length 
                  ? 'Browse our complete collection of professional templates'
                  : `Found ${filteredTemplates.length} template${filteredTemplates.length !== 1 ? 's' : ''}`
                }
              </p>
            </div>
          </div>
          
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
                <Palette className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No templates found</h3>
              <p className="text-gray-600 text-lg mb-6">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;