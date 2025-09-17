import React, { useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useTemplate } from '../contexts/TemplateContext';
import { 
  Type, 
  Palette, 
  Image, 
  Download, 
  Save, 
  Undo, 
  Redo,
  Move,
  Phone,
  Globe,
  Mail
} from 'lucide-react';

const CustomizePage = () => {
  const { templateId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const { saveDesign } = useTemplate();
  
  const template = location.state?.template || {
    id: templateId,
    name: 'Custom Template',
    thumbnail: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=800'
  };

  const [design, setDesign] = useState({
    backgroundImage: template.thumbnail,
    backgroundColor: '#ffffff',
    elements: [
      {
        id: 1,
        type: 'text',
        content: 'Your Brand Name',
        x: 50,
        y: 50,
        fontSize: 32,
        fontFamily: 'Inter',
        color: '#000000',
        fontWeight: 'bold'
      },
      {
        id: 2,
        type: 'text',
        content: 'Your inspiring quote goes here',
        x: 50,
        y: 120,
        fontSize: 18,
        fontFamily: 'Inter',
        color: '#333333',
        fontWeight: 'normal'
      }
    ]
  });

  const [selectedElement, setSelectedElement] = useState(null);
  const [activeTab, setActiveTab] = useState('text');
  const [logo, setLogo] = useState(null);

  const handleElementChange = (elementId, property, value) => {
    setDesign(prev => ({
      ...prev,
      elements: prev.elements.map(element =>
        element.id === elementId ? { ...element, [property]: value } : element
      )
    }));
  };

  const addTextElement = () => {
    const newElement = {
      id: Date.now(),
      type: 'text',
      content: 'New Text',
      x: 100,
      y: 200,
      fontSize: 16,
      fontFamily: 'Inter',
      color: '#000000',
      fontWeight: 'normal'
    };
    setDesign(prev => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target.result);
        const logoElement = {
          id: Date.now(),
          type: 'image',
          src: e.target.result,
          x: 300,
          y: 50,
          width: 100,
          height: 100
        };
        setDesign(prev => ({
          ...prev,
          elements: [...prev.elements, logoElement]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadDesign = (format) => {
    // Mock download functionality
    alert(`Downloading design as ${format.toUpperCase()}...`);
  };

  const saveCurrentDesign = () => {
    const designData = {
      ...design,
      name: `${template.name} - Custom`,
      templateId: template.id,
      thumbnail: template.thumbnail
    };
    saveDesign(designData);
    alert('Design saved successfully!');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg border-r overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Customize Design</h2>
          
          {/* Tabs */}
          <div className="flex space-x-1 mb-6">
            {[
              { id: 'text', label: 'Text', icon: Type },
              { id: 'style', label: 'Style', icon: Palette },
              { id: 'media', label: 'Media', icon: Image }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === id
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Text Tab */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              <button
                onClick={addTextElement}
                className="w-full btn-primary"
              >
                Add Text Element
              </button>
              
              {selectedElement && selectedElement.type === 'text' && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium">Edit Text</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content
                    </label>
                    <textarea
                      value={selectedElement.content}
                      onChange={(e) => handleElementChange(selectedElement.id, 'content', e.target.value)}
                      className="input-field w-full"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Font Size
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="72"
                        value={selectedElement.fontSize}
                        onChange={(e) => handleElementChange(selectedElement.id, 'fontSize', parseInt(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-500">{selectedElement.fontSize}px</span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Color
                      </label>
                      <input
                        type="color"
                        value={selectedElement.color}
                        onChange={(e) => handleElementChange(selectedElement.id, 'color', e.target.value)}
                        className="w-full h-10 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Font Weight
                    </label>
                    <select
                      value={selectedElement.fontWeight}
                      onChange={(e) => handleElementChange(selectedElement.id, 'fontWeight', e.target.value)}
                      className="input-field w-full"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                      <option value="lighter">Light</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Contact Details */}
              <div className="space-y-3">
                <h3 className="font-medium">Add Contact Details</h3>
                <button
                  onClick={() => {
                    const phoneElement = {
                      id: Date.now(),
                      type: 'text',
                      content: '+1 (555) 123-4567',
                      x: 50,
                      y: 300,
                      fontSize: 14,
                      fontFamily: 'Inter',
                      color: '#666666',
                      fontWeight: 'normal'
                    };
                    setDesign(prev => ({
                      ...prev,
                      elements: [...prev.elements, phoneElement]
                    }));
                  }}
                  className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Phone size={16} />
                  <span>Add Phone Number</span>
                </button>
                
                <button
                  onClick={() => {
                    const emailElement = {
                      id: Date.now(),
                      type: 'text',
                      content: 'info@company.com',
                      x: 50,
                      y: 320,
                      fontSize: 14,
                      fontFamily: 'Inter',
                      color: '#666666',
                      fontWeight: 'normal'
                    };
                    setDesign(prev => ({
                      ...prev,
                      elements: [...prev.elements, emailElement]
                    }));
                  }}
                  className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Mail size={16} />
                  <span>Add Email</span>
                </button>
                
                <button
                  onClick={() => {
                    const websiteElement = {
                      id: Date.now(),
                      type: 'text',
                      content: 'www.company.com',
                      x: 50,
                      y: 340,
                      fontSize: 14,
                      fontFamily: 'Inter',
                      color: '#666666',
                      fontWeight: 'normal'
                    };
                    setDesign(prev => ({
                      ...prev,
                      elements: [...prev.elements, websiteElement]
                    }));
                  }}
                  className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Globe size={16} />
                  <span>Add Website</span>
                </button>
              </div>
            </div>
          )}

          {/* Style Tab */}
          {activeTab === 'style' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <input
                  type="color"
                  value={design.backgroundColor}
                  onChange={(e) => setDesign(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  className="w-full h-12 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setDesign(prev => ({ ...prev, backgroundImage: e.target.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="input-field w-full"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setDesign(prev => ({ ...prev, backgroundColor: '#f3f4f6' }))}
                  className="h-12 bg-gray-100 rounded-lg border-2 border-gray-300 hover:border-primary-500 transition-colors"
                ></button>
                <button
                  onClick={() => setDesign(prev => ({ ...prev, backgroundColor: '#dbeafe' }))}
                  className="h-12 bg-blue-100 rounded-lg border-2 border-gray-300 hover:border-primary-500 transition-colors"
                ></button>
                <button
                  onClick={() => setDesign(prev => ({ ...prev, backgroundColor: '#dcfce7' }))}
                  className="h-12 bg-green-100 rounded-lg border-2 border-gray-300 hover:border-primary-500 transition-colors"
                ></button>
              </div>
            </div>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="input-field w-full"
                />
              </div>
              
              {logo && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <img src={logo} alt="Logo" className="w-20 h-20 object-contain mx-auto" />
                  <p className="text-sm text-gray-600 text-center mt-2">Logo uploaded</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Undo size={20} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Redo size={20} />
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <span className="text-sm text-gray-600">{template.name}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={saveCurrentDesign}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save size={16} />
              <span>Save</span>
            </button>
            
            <div className="relative group">
              <button className="flex items-center space-x-2 btn-primary">
                <Download size={16} />
                <span>Download</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-2">
                  <button
                    onClick={() => downloadDesign('jpg')}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm"
                  >
                    Download as JPG
                  </button>
                  <button
                    onClick={() => downloadDesign('png')}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm"
                  >
                    Download as PNG
                  </button>
                  <button
                    onClick={() => downloadDesign('pdf')}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm"
                  >
                    Download as PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div
              ref={canvasRef}
              className="relative w-full h-96 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
              style={{
                backgroundColor: design.backgroundColor,
                backgroundImage: design.backgroundImage ? `url(${design.backgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {design.elements.map((element) => (
                <div
                  key={element.id}
                  className={`absolute cursor-pointer border-2 ${
                    selectedElement?.id === element.id
                      ? 'border-primary-500'
                      : 'border-transparent hover:border-gray-400'
                  }`}
                  style={{
                    left: element.x,
                    top: element.y,
                    fontSize: element.fontSize,
                    fontFamily: element.fontFamily,
                    color: element.color,
                    fontWeight: element.fontWeight,
                    width: element.width,
                    height: element.height
                  }}
                  onClick={() => setSelectedElement(element)}
                  draggable
                  onDragEnd={(e) => {
                    const rect = canvasRef.current.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    handleElementChange(element.id, 'x', Math.max(0, x));
                    handleElementChange(element.id, 'y', Math.max(0, y));
                  }}
                >
                  {element.type === 'text' ? (
                    <div className="whitespace-pre-wrap">{element.content}</div>
                  ) : element.type === 'image' ? (
                    <img
                      src={element.src}
                      alt="Element"
                      className="w-full h-full object-contain"
                    />
                  ) : null}
                  
                  {selectedElement?.id === element.id && (
                    <div className="absolute -top-6 -left-1 bg-primary-600 text-white px-2 py-1 rounded text-xs">
                      <Move size={12} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 text-center text-sm text-gray-600">
              Click on elements to select and edit them. Drag to reposition.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizePage;