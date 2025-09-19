## Tempify – Template Design Platform

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
Templify/
├── AWT_PROJECT_ADMIN_PANEL/          # Admin server + static admin UI
│   ├── index.js                      # Express app (serves admin.html)
│   ├── public/                       # Admin UI
│   │   ├── admin.html                # Admin SPA (login + sections)
│   │   ├── admin.css
│   │   └── admin.js
│   ├── routes/                       # Admin routes (now use Cloudinary)
│   ├── models/                       # Mongoose models (Template/Frame aligned)
│   └── config/cloudinary.js          # Cloudinary helper
│
└── AWT_PROJECT_USER_PANEL/           # Main app (client + API server)
    ├── client/                       # React (JS) + Tailwind + Vite
    │   └── src/
    │       ├── components/           # Layout, TemplateCard, etc.
    │       ├── contexts/             # AuthContext, TemplateContext
    │       ├── pages/                # Home, Login, Signup, Customize, etc.
    │       └── lib/api.js            # Client API utilities
    └── server/                       # Node/Express API
        ├── src/
        │   ├── controllers/          # auth, template, frame, design, category
        │   ├── routes/               # admin, auth, template, category, frame
        │   ├── middlewares/          # auth, validation, uploads, error
        │   ├── models/               # User, Template, Frame, etc.
        │   ├── config/               # cloudinary, database
        │   ├── utils/                # helpers, seeding
        │   └── scripts/              # createAdmin.js
        └── index.js                  # Server bootstrap
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
# Create .env with at least:
# NODE_ENV=development
# PORT=3000
# MONGODB_URI=mongodb://localhost:27017/tempify
# JWT_SECRET=change_me
# CLIENT_URL=http://localhost:5173
# ADMIN_URL=http://localhost:3001
# CLOUDINARY_CLOUD_NAME=your_cloud
# CLOUDINARY_API_KEY=your_key
# CLOUDINARY_API_SECRET=your_secret
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
cd ../AWT_PROJECT_USER_PANEL/client
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
POST   /auth/register
POST   /auth/login
GET    /auth/me
PUT    /auth/me
POST   /auth/change-password
POST   /auth/logout
```

Templates

```
GET    /templates
POST   /templates                  (admin)
GET    /templates/:id
PUT    /templates/:id              (admin)
DELETE /templates/:id              (admin)
```

Categories

```
GET    /categories
POST   /categories                 (admin)
GET    /categories/masters
POST   /categories/masters         (admin)
```

Frames & Designs

```
GET    /frames
POST   /frames                     (admin)
POST   /frames/with-elements       (admin)

GET    /designs
POST   /designs
GET    /designs/:id
PUT    /designs/:id
DELETE /designs/:id
```

Admin

```
GET    /admin/stats                (admin)
GET    /admin/users                (admin)
PATCH  /admin/users/:id/toggle-status  (admin)
DELETE /admin/users/:id            (admin)
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
