import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  categoriesApi,
  templatesApi,
  apiRequest,
  getApiBaseUrl,
} from "../lib/api";

const TemplateContext = createContext();

const templateReducer = (state, action) => {
  switch (action.type) {
    case "SET_TEMPLATES":
      return {
        ...state,
        templates: action.payload,
      };
    case "SET_CATEGORIES":
      return {
        ...state,
        categories: action.payload,
      };
    case "SET_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    case "SAVE_DESIGN":
      return {
        ...state,
        savedDesigns: [...state.savedDesigns, action.payload],
      };
    case "UPDATE_DESIGN":
      return {
        ...state,
        savedDesigns: state.savedDesigns.map((design) =>
          design.id === action.payload.id ? action.payload : design
        ),
      };
    case "DELETE_DESIGN":
      return {
        ...state,
        savedDesigns: state.savedDesigns.filter(
          (design) => design.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

const initialTemplates = [];

export const TemplateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(templateReducer, {
    templates: initialTemplates,
    categories: ["All"],
    filters: {
      category: "All",
      search: "",
      sortBy: "popularity",
    },
    savedDesigns: [],
  });

  // Load templates and categories from backend on mount
  useEffect(() => {
    (async () => {
      try {
        const [catsRes, tmplRes] = await Promise.all([
          categoriesApi.getCategories({ limit: 100 }),
          templatesApi.getTemplates({ limit: 48, sort: "-createdAt" }),
        ]);

        const cats = ["All", ...(catsRes.categories || []).map((c) => c.name)];

        const now = Date.now();
        const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;
        const tmpls = (tmplRes.templates || []).map((t) => {
          const createdAt = t.createdAt ? new Date(t.createdAt).getTime() : now;
          const isLatest = now - createdAt <= fourteenDaysMs;
          return {
            id: t._id,
            name: t.name,
            category: t.categoryId?.name || t.category_id?.name || "General",
            thumbnail:
              t.imageUrl ||
              t.cloudinaryUrl ||
              (t.imagePath
                ? `${getApiBaseUrl()}/Template_images/${t.imagePath}`
                : ""),
            trending: !!t.isFeatured,
            latest: isLatest,
          };
        });

        dispatch({ type: "SET_CATEGORIES", payload: cats });
        dispatch({ type: "SET_TEMPLATES", payload: tmpls });
      } catch (e) {
        // Fallback to initial data on failure
      }
    })();
  }, []);

  const setFilters = (filters) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  };

  const saveDesign = async (design) => {
    const token = localStorage.getItem("token");
    // Normalize to API schema
    const payload = {
      name: design.name,
      templateId: String(design.templateId || design.template_id || ""),
      canvas: {
        backgroundImage:
          design.backgroundImage || design.canvas?.backgroundImage || "",
        backgroundColor:
          design.backgroundColor || design.canvas?.backgroundColor || "#ffffff",
        dimensions: {
          width: design.canvas?.dimensions?.width || 800,
          height: design.canvas?.dimensions?.height || 600,
        },
      },
      elements: (design.elements || []).map((el) => ({
        type: el.type,
        content: el.content,
        src: el.src,
        position: { x: el.x || 0, y: el.y || 0, z: el.z || 0 },
        dimensions: { width: el.width || 100, height: el.height || 50 },
        styling: {
          fontSize: el.fontSize || 16,
          fontFamily: el.fontFamily || "Inter",
          fontWeight: el.fontWeight || "normal",
          color: el.color || "#000000",
          backgroundColor: el.backgroundColor || "transparent",
          borderRadius: el.borderRadius || 0,
          opacity: typeof el.opacity === "number" ? el.opacity : 1,
          rotation: el.rotation || 0,
        },
      })),
    };

    // Add a basic thumbnail using backgroundImage so it appears in the grid
    payload.thumbnailPath = payload.canvas.backgroundImage || "";

    const res = await apiRequest("/saved-designs", {
      method: "POST",
      body: payload,
      token,
    });
    const saved = {
      ...res.design,
      id: res.design._id,
      createdAt: res.design.createdAt,
      thumbnail: res.design.thumbnailPath || payload.thumbnailPath || "",
    };
    dispatch({ type: "SAVE_DESIGN", payload: saved });
  };

  const updateDesign = (design) => {
    dispatch({ type: "UPDATE_DESIGN", payload: design });
  };

  const deleteDesign = async (designId) => {
    const token = localStorage.getItem("token");
    await apiRequest(`/saved-designs/${designId}`, { method: "DELETE", token });
    dispatch({ type: "DELETE_DESIGN", payload: designId });
  };

  // Load saved designs when authenticated
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await apiRequest("/saved-designs", { token });
        const list = res.designs.map((d) => ({
          ...d,
          id: d._id,
          thumbnail: d.thumbnailPath || d.canvas?.backgroundImage || "",
        }));
        dispatch({ type: "SET_FILTERS", payload: {} });
        list.forEach((d) => dispatch({ type: "SAVE_DESIGN", payload: d }));
      } catch {}
    })();
  }, []);

  const getFilteredTemplates = () => {
    let filtered = state.templates;

    if (state.filters.category !== "All") {
      filtered = filtered.filter(
        (template) => template.category === state.filters.category
      );
    }

    if (state.filters.search) {
      filtered = filtered.filter(
        (template) =>
          template.name
            .toLowerCase()
            .includes(state.filters.search.toLowerCase()) ||
          template.category
            .toLowerCase()
            .includes(state.filters.search.toLowerCase())
      );
    }

    return filtered;
  };

  return (
    <TemplateContext.Provider
      value={{
        ...state,
        setFilters,
        saveDesign,
        updateDesign,
        deleteDesign,
        getFilteredTemplates,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplate = () => {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error("useTemplate must be used within TemplateProvider");
  }
  return context;
};
