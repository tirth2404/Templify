import React, { useState } from 'react';
import { useTemplate } from '../contexts/TemplateContext';
import { useAuth } from '../contexts/AuthContext';
import { Edit3, Download, Trash2, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SavedDesignsPage = () => {
  const { savedDesigns, deleteDesign } = useTemplate();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const filteredDesigns = savedDesigns
    .filter(design => 
      design.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  const handleEdit = (design) => {
    navigate(`/customize/${design.templateId}`, { 
      state: { 
        template: { 
          id: design.templateId, 
          name: design.name,
          thumbnail: design.thumbnail 
        },
        savedDesign: design
      } 
    });
  };

  const handleDelete = (designId) => {
    if (window.confirm('Are you sure you want to delete this design?')) {
      deleteDesign(designId);
    }
  };

  const handleDownload = (design, format) => {
    // Mock download functionality
    alert(`Downloading "${design.name}" as ${format.toUpperCase()}...`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Saved Designs
        </h1>
        <p className="text-gray-600">
          Manage and download your saved designs
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search designs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {filteredDesigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDesigns.map((design) => (
            <div key={design.id} className="bg-white rounded-lg shadow-md border overflow-hidden group">
              <div className="relative aspect-w-16 aspect-h-9">
                <img
                  src={design.thumbnail}
                  alt={design.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-x-2">
                    <button
                      onClick={() => handleEdit(design)}
                      className="bg-white text-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                      title="Edit Design"
                    >
                      <Edit3 size={16} />
                    </button>
                    <div className="relative group/dropdown">
                      <button className="bg-white text-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                        <Download size={16} />
                      </button>
                      <div className="absolute top-full right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-200 z-10">
                        <div className="p-2">
                          <button
                            onClick={() => handleDownload(design, 'jpg')}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm"
                          >
                            Download JPG
                          </button>
                          <button
                            onClick={() => handleDownload(design, 'png')}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm"
                          >
                            Download PNG
                          </button>
                          <button
                            onClick={() => handleDownload(design, 'pdf')}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm"
                          >
                            Download PDF
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(design.id)}
                      className="bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors"
                      title="Delete Design"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1 truncate">
                  {design.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Created {formatDate(design.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Download className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No designs found' : 'No saved designs yet'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm 
              ? 'Try adjusting your search term' 
              : 'Start creating and saving your designs to see them here'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => navigate('/home')}
              className="btn-primary"
            >
              Browse Templates
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedDesignsPage;