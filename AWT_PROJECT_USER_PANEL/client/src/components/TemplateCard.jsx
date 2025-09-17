import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, Eye, Sparkles, TrendingUp, Clock } from 'lucide-react';

const TemplateCard = ({ template, showActions = true }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/customize/${template.id}`, { state: { template } });
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer">
      <div className="relative aspect-w-16 aspect-h-9">
        <img
          src={template.thumbnail}
          alt={template.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          {showActions && (
            <div className="flex space-x-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit();
                }}
                className="bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-xl shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
                title="Edit Template"
              >
                <Edit3 size={18} />
              </button>
              <button 
                className="bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-xl shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
                title="Preview Template"
              >
                <Eye size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Status badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {template.trending && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full shadow-lg">
              <TrendingUp size={12} />
              <span className="font-medium">Trending</span>
            </div>
          )}
          {template.latest && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs rounded-full shadow-lg">
              <Clock size={12} />
              <span className="font-medium">Latest</span>
            </div>
          )}
        </div>

        {/* Category badge */}
        <div className="absolute top-3 right-3">
          <div className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs rounded-full shadow-lg font-medium">
            {template.category}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors duration-200">
            {template.name}
          </h3>
          <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Sparkles className="text-white h-3 w-3" />
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Professional {template.category.toLowerCase()} template for your business
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Ready to customize</span>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Customize
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;