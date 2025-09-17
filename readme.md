# Tempify - Template Design Platform

A complete full-stack web application for creating, customizing, and managing design templates. Built with React.js frontend and Node.js backend, Tempify enables users to create professional designs using pre-built templates and frames with drag-and-drop functionality.

## 🚀 Features

### User Features
- **Authentication System**: Secure signup/login with JWT tokens
- **Template Library**: Browse templates by categories (Festival, Business, Social Media, etc.)
- **Design Customization**: 
  - Drag-and-drop text and image elements
  - Real-time canvas editing
  - Font customization (size, color, weight)
  - Background customization
  - Logo upload and positioning
- **Contact Details Integration**: Add phone, email, website, and social media links
- **Save & Export**: Save designs and export in multiple formats (JPG, PNG, PDF)
- **Profile Management**: Update company details and social media links
- **Design Gallery**: View and manage saved designs

### Admin Features
- **Dashboard**: Complete analytics and statistics
- **Category Management**: Create and organize master categories and subcategories
- **Template Management**: Upload and manage template library
- **Frame Management**: Create frames with positioned elements for business cards
- **User Management**: Monitor user activity and manage accounts
- **File Management**: Handle image uploads with validation

## 🛠️ Tech Stack

### Frontend
- **React 18** with Hooks and Context API
- **React Router DOM** for navigation
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Helmet** for security headers
- **CORS** for cross-origin requests

## 📁 Project Structure

```
tempify/
├── AWT_PROJECT_ADMIN_PANEL/          # Legacy admin panel (Node.js)
│   ├── models/                       # Database models
│   ├── routes/                       # API routes
│   ├── public/                       # Static admin files
│   └── index.js                      # Admin server entry
│
├── AWT_PROJECT_USER_PANEL/           # Main application
│   ├── client/                       # React frontend
│   │   ├── src/
│   │   │   ├── components/           # Reusable UI components
│   │   │   ├── contexts/             # React Context providers
│   │   │   ├── pages/                # Page components
│   │   │   ├── lib/                  # Utility functions
│   │   │   └── App.jsx               # Main App component
│   │   ├── public/                   # Static assets
│   │   └── package.json              # Frontend dependencies
│   │
│   └── server/                       # New backend (recommended)
│       ├── src/
│       │   ├── controllers/          # Request handlers
│       │   ├── models/               # Database models
│       │   ├── routes/               # API routes
│       │   ├── middleware/           # Custom middleware
│       │   ├── utils/                # Helper functions
│       │   ├── config/               # Configuration files
│       │   └── scripts/              # Database seeds & utilities
│       └── package.json              # Backend dependencies
│
└── README.md                         # This file
```

## 🚦 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Backend Setup

1. **Navigate to the backend directory:**
```bash
cd AWT_PROJECT_USER_PANEL/server
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Configure environment variables:**
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/tempify
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:3001
```

5. **Seed the database with sample data:**
```bash
npm run db:seed
```

6. **Start the development server:**
```bash
npm run dev
```

Backend will be running at `http://localhost:3000`

### Frontend Setup

1. **Navigate to the frontend directory:**
```bash
cd AWT_PROJECT_USER_PANEL/client
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

Frontend will be running at `http://localhost:5173`

## 🔐 Default Credentials

After running the database seeder, you can use these credentials:

### Admin Account
- **Email:** admin@tempify.com
- **Password:** admin123

### Test User Account
- **Email:** test@example.com
- **Password:** test123

## 📋 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints
```
POST   /auth/register          # Register new user
POST   /auth/login             # Login user
GET    /auth/me                # Get current user profile
PUT    /auth/me                # Update user profile
POST   /auth/change-password   # Change password
POST   /auth/logout            # Logout user
```

### Template Endpoints
```
GET    /templates              # Get all templates
POST   /templates              # Create template (Admin only)
GET    /templates/:id          # Get template by ID
PUT    /templates/:id          # Update template (Admin only)
DELETE /templates/:id          # Delete template (Admin only)
```

### Category Endpoints
```
GET    /categories             # Get all categories
POST   /categories             # Create category (Admin only)
GET    /categories/masters     # Get master categories
POST   /categories/masters     # Create master category (Admin only)
```

### Design Endpoints
```
GET    /designs                # Get user's saved designs
POST   /designs                # Save new design
GET    /designs/:id            # Get design by ID
PUT    /designs/:id            # Update design
DELETE /designs/:id            # Delete design
```

### Frame Endpoints
```
GET    /frames                 # Get all frames
POST   /frames                 # Create frame (Admin only)
GET    /frames/:id             # Get frame with elements
POST   /frames/with-elements   # Create frame with positioned elements
```

### Admin Endpoints
```
GET    /admin/stats            # Get dashboard statistics
GET    /admin/users            # Get all users
PATCH  /admin/users/:id/toggle-status  # Toggle user status
DELETE /admin/users/:id        # Delete user
```

## 🎨 Usage Guide

### For Users

1. **Sign Up/Login**: Create an account or login with existing credentials
2. **Browse Templates**: Explore templates by categories like Festival, Business, Social Media
3. **Customize Design**: 
   - Select a template to start customizing
   - Add/edit text elements with custom fonts and colors
   - Upload and position your logo
   - Add contact details (phone, email, website)
   - Change background colors or upload custom backgrounds
4. **Save & Export**: Save your design and export in preferred format
5. **Manage Designs**: View all saved designs in your profile

### For Administrators

1. **Admin Login**: Use admin credentials to access admin features
2. **Manage Categories**: Create master categories and subcategories
3. **Upload Templates**: Add new templates to the library with proper categorization
4. **Create Frames**: Design business card frames with positioned elements
5. **User Management**: Monitor user activity and manage accounts
6. **Analytics**: View platform statistics and usage metrics

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Server Configuration
NODE_ENV=development
PORT=3000
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:3001

# Database
MONGODB_URI=mongodb://localhost:27017/tempify

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=jpg,jpeg,png,webp

# Optional: Cloudinary for cloud storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Frontend (Optional .env)
```env
VITE_API_URL=http://localhost:3000
```

## 📦 Available Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run db:seed    # Seed database with sample data
npm test           # Run tests
npm run lint       # Run ESLint
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🚀 Deployment

### Backend Deployment

1. **Environment Setup:**
   - Set NODE_ENV to 'production'
   - Configure production MongoDB URI
   - Set secure JWT secret
   - Configure CORS for production domains

2. **Build Process:**
   ```bash
   npm install --production
   ```

3. **Start Production Server:**
   ```bash
   npm start
   ```

### Frontend Deployment

1. **Build for Production:**
   ```bash
   npm run build
   ```

2. **Deploy dist/ folder** to your hosting service (Vercel, Netlify, AWS S3, etc.)

### Production Considerations

- Use environment variables for all sensitive configuration
- Enable HTTPS in production
- Set up proper CORS policies
- Configure rate limiting
- Set up file storage (local or cloud)
- Enable MongoDB authentication
- Set up monitoring and logging
- Configure backup strategies

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

### Development Guidelines

- Follow the existing code style and structure
- Write meaningful commit messages
- Add proper error handling
- Include input validation
- Write tests for new features
- Update documentation as needed

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check connection URI in .env file
   - Verify database name and credentials

2. **File Upload Issues:**
   - Check file size limits
   - Verify upload directory permissions
   - Ensure allowed file types are configured

3. **CORS Errors:**
   - Verify frontend URL in backend CORS configuration
   - Check if both servers are running
   - Confirm port numbers match

4. **JWT Token Issues:**
   - Verify JWT_SECRET is set
   - Check token expiration settings
   - Clear browser storage and re-login

### Getting Help

- Check the Issues section for known problems
- Review API documentation for proper endpoint usage
- Verify environment variable configuration
- Check browser console and server logs for detailed errors

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - Initial work and development

## 🙏 Acknowledgments

- React.js team for the excellent frontend framework
- Express.js community for the robust backend framework
- MongoDB team for the flexible database solution
- Tailwind CSS for the utility-first CSS framework
- All open-source contributors who made this project possible

---

**Built with ❤️ for the design community**