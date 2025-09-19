# Tempify - Template Design Platform

A modern, full-stack platform for creating, customizing, and managing design templates. Built with React, Node.js, Express, MongoDB, and Cloudinary for seamless template management and design workflows.

## 🚀 Features

### User Features
- **Account Management**: Complete signup/login system with profile management
- **Template Library**: Browse and search through categorized design templates
- **Template Customization**: Drag-and-drop editor with text, image, and styling tools
- **Design Management**: Save, edit, and organize custom designs
- **Export Options**: Download designs in multiple formats (JPG, PNG, PDF)
- **Contact Integration**: Add company details, social links, and contact information
- **Responsive Design**: Works seamlessly across desktop and mobile devices

### Admin Features  
- **Admin Dashboard**: Comprehensive analytics and management interface
- **Template Management**: Upload, categorize, and manage template library
- **Frame System**: Create custom frames with positioned elements
- **Category Management**: Organize templates with master categories and subcategories
- **User Management**: Monitor user activity and manage accounts
- **Cloud Storage**: Integrated Cloudinary support for optimized image delivery

## 🏗 Architecture

### Frontend (React + Vite)
- **Modern React 18** with hooks and functional components
- **Tailwind CSS** for utility-first styling
- **React Router** for client-side routing
- **Context API** for state management
- **Vite** for fast development and building

### Backend (Node.js + Express)
- **RESTful API** with comprehensive endpoint coverage
- **JWT Authentication** with role-based access control
- **MongoDB** with Mongoose ODM
- **Cloudinary Integration** for image storage and optimization
- **File Upload** with Multer middleware
- **Input Validation** with express-validator
- **Error Handling** with centralized middleware

### Database Structure
- **Users**: Account management with social links
- **Templates**: Design assets with categorization
- **Categories**: Hierarchical organization system
- **Frames**: Positioned element templates
- **Saved Designs**: User-created customizations
- **Master Categories**: Top-level template organization

## 📦 Project Structure

```
Tempify/
├── AWT_PROJECT_ADMIN_PANEL/          # Legacy admin interface
│   ├── index.js                      # Admin server
│   ├── public/                       # Static admin UI
│   ├── routes/                       # Admin API routes
│   └── models/                       # Shared database models
│
└── AWT_PROJECT_USER_PANEL/           # Main application
    ├── client/                       # React frontend
    │   ├── src/
    │   │   ├── components/           # Reusable UI components
    │   │   ├── contexts/             # React context providers
    │   │   ├── pages/                # Route components
    │   │   └── lib/                  # API utilities
    │   └── public/                   # Static assets
    │
    └── server/                       # Express backend
        └── src/
            ├── controllers/          # Route logic
            ├── models/               # Mongoose schemas
            ├── routes/               # API endpoints
            ├── middleware/           # Custom middleware
            ├── config/               # Configuration files
            └── utils/                # Helper functions
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB 4.4+
- npm or yarn
- Cloudinary account (optional, for image optimization)

### 1. Environment Setup

Create `.env` files in both server directories:

**AWT_PROJECT_USER_PANEL/server/.env**
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/tempify
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:3001

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**AWT_PROJECT_ADMIN_PANEL/.env**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/tempify
JWT_SECRET=your-super-secure-jwt-secret-key-here
CLIENT_ORIGIN=http://localhost:5173

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 2. Database Setup

Start MongoDB locally or use a cloud instance:
```bash
# If using local MongoDB
mongod

# Or start MongoDB service
sudo systemctl start mongod
```

### 3. Backend Setup

**Main API Server:**
```bash
cd AWT_PROJECT_USER_PANEL/server
npm install
npm run dev
```

**Admin Panel Server:**
```bash
cd AWT_PROJECT_ADMIN_PANEL
npm install
npm run dev
```

### 4. Frontend Setup

```bash
cd AWT_PROJECT_USER_PANEL/client
npm install
npm run dev
```

### 5. Create Admin User

```bash
cd AWT_PROJECT_USER_PANEL/server
node src/scripts/createAdmin.js
```

### 6. Seed Database (Optional)

```bash
cd AWT_PROJECT_USER_PANEL/server
npm run db:seed
```

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Main API**: http://localhost:3000
- **Admin Panel**: http://localhost:3001
- **Health Check**: http://localhost:3000/health

## 🔐 Default Credentials

After running the setup scripts:

**Admin User:**
- Email: `admin@gmail.com`
- Password: `admin123`

**Test User (if seeded):**
- Email: `test@example.com`
- Password: `test123`

## 📡 API Documentation

### Authentication Endpoints
```
POST   /api/auth/register     # User registration
POST   /api/auth/login        # User login
GET    /api/auth/me           # Get current user
PUT    /api/auth/me           # Update profile
POST   /api/auth/change-password  # Change password
POST   /api/auth/logout       # Logout user
```

### Template Endpoints
```
GET    /api/templates         # Get all templates
POST   /api/templates         # Create template (Admin)
GET    /api/templates/:id     # Get template by ID
PUT    /api/templates/:id     # Update template (Admin)
DELETE /api/templates/:id     # Delete template (Admin)
POST   /api/templates/:id/download  # Increment download count
```

### Category Endpoints
```
GET    /api/categories        # Get all categories
POST   /api/categories        # Create category (Admin)
GET    /api/categories/masters # Get master categories
POST   /api/categories/masters # Create master category (Admin)
```

### Design Endpoints
```
GET    /api/designs           # Get user designs
POST   /api/designs           # Save design
GET    /api/designs/:id       # Get design by ID
PUT    /api/designs/:id       # Update design
DELETE /api/designs/:id       # Delete design
```

### Admin Endpoints
```
GET    /api/admin/stats       # Admin dashboard stats
GET    /api/admin/users       # Get all users
PATCH  /api/admin/users/:id/toggle-status  # Toggle user status
DELETE /api/admin/users/:id   # Delete user
```

## 🎨 Key Features Deep Dive

### Template Customization Engine
- **Drag & Drop Interface**: Intuitive element positioning
- **Text Editing**: Font customization, sizing, and coloring
- **Image Integration**: Logo uploads and positioning
- **Contact Details**: Automated contact information placement
- **Background Customization**: Color and image backgrounds
- **Live Preview**: Real-time design updates

### Storage Strategy
- **Local Development**: File storage in public directories
- **Production**: Cloudinary integration for optimization
- **Fallback Support**: Graceful degradation when cloud storage unavailable
- **Automatic Cleanup**: Temporary file management

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Admin and user permission levels
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: API abuse prevention
- **File Type Validation**: Secure file upload handling

## 🛠 Development

### Code Structure
- **Controllers**: Business logic separation
- **Middleware**: Authentication, validation, error handling
- **Models**: MongoDB schema definitions with validation
- **Routes**: Clean API endpoint organization
- **Utils**: Shared helper functions and constants

### Best Practices Implemented
- **Error Handling**: Centralized error middleware
- **Validation**: Input sanitization and validation
- **Security**: Helmet, CORS, and rate limiting
- **Performance**: Image optimization and caching
- **Maintainability**: Modular code organization

## 📱 Frontend Architecture

### Component Structure
- **Layout**: Responsive navigation and layout wrapper
- **Pages**: Route-based page components
- **Components**: Reusable UI elements
- **Contexts**: Global state management

### State Management
- **AuthContext**: User authentication state
- **TemplateContext**: Template and design management
- **Local State**: Component-specific state with hooks

### Styling Approach
- **Tailwind CSS**: Utility-first responsive design
- **Custom Components**: Consistent design system
- **Mobile-First**: Responsive design principles

## 🚀 Deployment

### Environment Preparation
1. Set production environment variables
2. Configure Cloudinary for image storage
3. Set up MongoDB Atlas or production database
4. Configure domain and SSL certificates

### Build Process
```bash
# Frontend build
cd AWT_PROJECT_USER_PANEL/client
npm run build

# Backend preparation
cd ../server
npm install --production
```

### Production Checklist
- [ ] Strong JWT secrets configured
- [ ] CORS origins locked down
- [ ] MongoDB authentication enabled
- [ ] Cloudinary production account configured
- [ ] Error logging and monitoring set up
- [ ] SSL/HTTPS enabled
- [ ] File upload limits configured
- [ ] Database backups scheduled

## 🔧 Configuration

### File Upload Limits
- **Max File Size**: 10MB per file
- **Allowed Types**: JPEG, PNG, WebP
- **Temporary Storage**: Automatic cleanup after 24 hours

### Database Indexes
- **Users**: Email uniqueness and role-based queries
- **Templates**: Category and search optimization
- **Categories**: Hierarchical organization
- **Designs**: User-based filtering and sorting

## 📊 Monitoring & Analytics

### Admin Dashboard Metrics
- User registration trends
- Template usage statistics
- Design creation analytics
- Popular category insights

### Performance Monitoring
- API response times
- File upload success rates
- Database query performance
- Error tracking and alerting

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Follow existing code style and conventions
4. Add tests for new functionality
5. Update documentation as needed
6. Submit pull request with detailed description

### Code Standards
- **ES6+** modern JavaScript features
- **Functional Components** with hooks
- **Error Boundaries** for fault tolerance
- **PropTypes** or TypeScript for type safety
- **ESLint** configuration following
- **Consistent Naming** conventions

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💡 Support

For support and questions:
- Create an issue in the repository
- Check existing documentation
- Review API endpoint documentation
- Verify environment configuration

## 🎯 Future Enhancements

- **Template Marketplace**: Community template sharing
- **Advanced Editor**: More design tools and features
- **Collaboration**: Team-based design workflows  
- **API Integrations**: Third-party service connections
- **Mobile App**: Native mobile applications
- **AI Features**: Automated design suggestions

---

**Built with ❤️ for designers and businesses who need professional templates quickly and easily.**