import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiRequest } from '../lib/api';

const TemplateContext = createContext();

const templateReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TEMPLATES':
      return {
        ...state,
        templates: action.payload
      };
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    case 'SAVE_DESIGN':
      return {
        ...state,
        savedDesigns: [...state.savedDesigns, action.payload]
      };
    case 'UPDATE_DESIGN':
      return {
        ...state,
        savedDesigns: state.savedDesigns.map(design => 
          design.id === action.payload.id ? action.payload : design
        )
      };
    case 'DELETE_DESIGN':
      return {
        ...state,
        savedDesigns: state.savedDesigns.filter(design => design.id !== action.payload)
      };
    default:
      return state;
  }
};

const initialTemplates = [
  {
    id: 1,
    name: 'Festival Greeting',
    category: 'Festival',
    thumbnail: 'https://images.pexels.com/photos/1708988/pexels-photo-1708988.jpeg?auto=compress&cs=tinysrgb&w=300',
    trending: true,
    latest: false
  },
  {
    id: 2,
    name: 'Daily Quote',
    category: 'Daily Quotes',
    thumbnail: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300',
    trending: false,
    latest: true
  },
  {
    id: 3,
    name: 'Business Promotion',
    category: 'Business Promotions',
    thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpg?auto=compress&cs=tinysrgb&w=300',
    trending: true,
    latest: true
  },
  {
    id: 4,
    name: 'Devotional Message',
    category: 'Devotional',
    thumbnail: 'https://images.pexels.com/photos/7292599/pexels-photo-7292599.jpeg?auto=compress&cs=tinysrgb&w=300',
    trending: false,
    latest: false
  }
];

export const TemplateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(templateReducer, {
    templates: initialTemplates,
    categories: ['All', 'Festival', 'Daily Quotes', 'Business Promotions', 'Devotional'],
    filters: {
      category: 'All',
      search: '',
      sortBy: 'popularity'
    },
    savedDesigns: []
  });

  // Load templates and categories from backend on mount
  useEffect(() => {
    (async () => {
      try {
        const [catsRes, tmplRes] = await Promise.all([
          apiRequest('/api/category/all'),
          apiRequest('/api/template/all')
        ]);
        const cats = ['All', ...catsRes.categories.map(c => c.name)];
        const tmpls = tmplRes.templates.map((t) => ({
          id: t._id,
          name: t.name,
          category: t.category_id?.name || 'General',
          thumbnail: `${window.location.origin.replace(/:\\d+$/, '')}/Template_images/${t.path}`
        }));
        dispatch({ type: 'SET_CATEGORIES', payload: cats });
        dispatch({ type: 'SET_TEMPLATES', payload: tmpls });
      } catch (e) {
        // Fallback to initial data on failure
      }
    })();
  }, []);

  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const saveDesign = async (design) => {
    const token = localStorage.getItem('token');
    const res = await apiRequest('/api/saved-designs', { method: 'POST', body: design, token });
    const saved = { ...res.design, id: res.design._id, createdAt: res.design.createdAt };
    dispatch({ type: 'SAVE_DESIGN', payload: saved });
  };

  const updateDesign = (design) => {
    dispatch({ type: 'UPDATE_DESIGN', payload: design });
  };

  const deleteDesign = async (designId) => {
    const token = localStorage.getItem('token');
    await apiRequest(`/api/saved-designs/${designId}`, { method: 'DELETE', token });
    dispatch({ type: 'DELETE_DESIGN', payload: designId });
  };

  // Load saved designs when authenticated
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await apiRequest('/api/saved-designs', { token });
        const list = res.designs.map(d => ({ ...d, id: d._id }));
        // populate without a reducer action? reuse SET_TEMPLATES? Create specific action
        dispatch({ type: 'SET_FILTERS', payload: {} });
        // Direct state mutation not allowed; instead re-dispatch via SAVE_DESIGN
        list.forEach(d => dispatch({ type: 'SAVE_DESIGN', payload: d }));
      } catch {}
    })();
  }, []);

  const getFilteredTemplates = () => {
    let filtered = state.templates;

    if (state.filters.category !== 'All') {
      filtered = filtered.filter(template => template.category === state.filters.category);
    }

    if (state.filters.search) {
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(state.filters.search.toLowerCase()) ||
        template.category.toLowerCase().includes(state.filters.search.toLowerCase())
      );
    }

    return filtered;
  };

  return (
    <TemplateContext.Provider value={{
      ...state,
      setFilters,
      saveDesign,
      updateDesign,
      deleteDesign,
      getFilteredTemplates
    }}>
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplate = () => {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error('useTemplate must be used within TemplateProvider');
  }
  return context;
};