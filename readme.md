# Tempify - Template Design Platform

Clean, minimal, full‑stack platform to browse, customize, and export design templates. The frontend is plain JavaScript (no TypeScript) using React + Tailwind CSS. The backend is Node.js/Express with MongoDB and Cloudinary for media storage.

### Highlights
- React + Tailwind (JS only) frontend with simple Vite setup
- Robust Node/Express API with JWT auth and role‑based admin endpoints
- Image uploads stored on Cloudinary (no repo bloat from images)
- Admin panel for categories, templates, frames, and users

## ✨ User‑Side Features (as implemented / targeted)
- Signup: company logo (UI), company name, email, password (show/hide), mobile, address, social links; validation; redirect to Login
- Login: email/password, “Remember Me”, “Forgot Password”; redirect to Home
- Home: welcome message, latest/trending templates, categories (Devotional, Festival, Daily Quotes, Business Promotions, etc.), search and filters, template thumbnails
- Template customization: add/edit text, change font/size/color, upload/place logo, add contact details, change background, drag & drop positioning, live preview
- Saved designs: save edits, download (JPG/PNG/PDF), re‑edit later
- Profile: edit company details, change password

## 🧭 Monorepo Structure
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

## 🛠️ Tech Stack
### Frontend
- React 18 (JavaScript only)
- React Router, Context API and/or hooks; optional Redux Toolkit
- Tailwind CSS (utility‑first styling)
- Vite (fast dev/build)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT auth, bcryptjs password hashing
- Multer (temp) + Cloudinary for image storage/optimization
- Helmet, CORS, rate limiting, compression, morgan

## ☁️ Cloudinary Storage (Admin + User APIs)
- Admin uploads (templates/frames) now go to Cloudinary, not local folders
- Models store `cloudinaryPublicId` and `cloudinaryUrl`; also `imagePath` is aligned so the user API can derive URLs consistently
- Temporary files are cleaned after upload

## 🚦 Quick Start
Prerequisites: Node 16+, MongoDB 4.4+, npm

### 1) Start the API (User Server)
```bash
cd AWT_PROJECT_USER_PANEL/server
npm install
npm run dev
```
API at `http://localhost:3000`.

Seed admin user (if you haven’t yet):
```bash
node src/scripts/createAdmin.js
# Admin: admin@gmail.com / admin123
```

### 2) Start the Admin Panel
```bash
cd ../../AWT_PROJECT_ADMIN_PANEL
npm install
npm run dev
```
Admin UI at `http://localhost:3001` (or the printed port). Log in with the admin credentials above.

### 3) Start the Frontend (Client)
```bash
cd AWT_PROJECT_USER_PANEL/client
npm install
npm run dev
```
Frontend at `http://localhost:5173`.

## 🔐 Default Credentials
- Admin: `admin@gmail.com` / `admin123` (created by `createAdmin.js`)
- Test user (if seeded via `utils/seedDatabase.js`): `test@example.com` / `test123`

## 🧱 Environment Variables (API)
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/tempify
JWT_SECRET=change_me
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:3001

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

## 🔌 Key API Endpoints (Base: `/api`)
Authentication
```
POST   /api/auth/register     # User registration
POST   /api/auth/login        # User login
GET    /api/auth/me           # Get current user
PUT    /api/auth/me           # Update profile
POST   /api/auth/change-password  # Change password
POST   /api/auth/logout       # Logout user
```
Templates
```
GET    /api/templates         # Get all templates
POST   /api/templates         # Create template (Admin)
GET    /api/templates/:id     # Get template by ID
PUT    /api/templates/:id     # Update template (Admin)
DELETE /api/templates/:id     # Delete template (Admin)
POST   /api/templates/:id/download  # Increment download count
```
Categories
```
GET    /api/categories        # Get all categories
POST   /api/categories        # Create category (Admin)
GET    /api/categories/masters # Get master categories
POST   /api/categories/masters # Create master category (Admin)
```
Frames & Designs
```
GET    /api/designs           # Get user designs
POST   /api/designs           # Save design
GET    /api/designs/:id       # Get design by ID
PUT    /api/designs/:id       # Update design
DELETE /api/designs/:id       # Delete design
```
Admin
```
GET    /api/admin/stats       # Admin dashboard stats
GET    /api/admin/users       # Get all users
PATCH  /api/admin/users/:id/toggle-status  # Toggle user status
DELETE /api/admin/users/:id   # Delete user
```

## 🧑‍💻 Frontend Notes
- Pure JS React (no TypeScript). Keep components small and focused
- Tailwind for styling; consider extracting reusable UI patterns
- State via Context API or Redux Toolkit—project already includes contexts
- API base configured to `http://localhost:3000/api` in client libs

## 🧪 Typical Flows
- User: Sign up → Login → Browse categories/templates → Customize → Save → Re‑edit or Download
- Admin: Login in admin panel → Manage masters/categories → Upload templates/frames (stored on Cloudinary) → Review users/analytics

## 🛡️ Production Checklist
- Replace Tailwind CDN in admin HTML with a built pipeline (optional)
- Set strong `JWT_SECRET` and HTTPS
- Lock down CORS origins
- Use production Cloudinary account
- Enable DB auth and backups
- Configure logging/monitoring

## 🐛 Troubleshooting
- 401 from admin endpoints: ensure you’re logged in and sending `Authorization: Bearer <token>` (admin panel now includes login)
- Images not showing: verify Cloudinary env vars and network access; check `cloudinaryPublicId`
- CORS errors: confirm `CLIENT_URL`/`ADMIN_URL` and ports
- Mongo connection: confirm `MONGODB_URI` and Mongo is running

## 🤝 Contributing
- Follow existing style, add validation and error handling
- Small, well‑named components and functions
- Update docs when behavior changes

---

Built with ❤️ for creators and teams.