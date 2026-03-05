# LMS Frontend - Quick Start Guide

## ✅ What Has Been Built

A complete Learning Management System frontend with the following features:

### Pages Created
- **Home** (`/`) - Displays list of available subjects
- **Login** (`/login`) - User authentication page
- **Register** (`/register`) - User registration page
- **Subject Page** (`/subjects/:subjectId`) - Subject content with sidebar
- **Video Page** (`/subjects/:subjectId/video/:videoId`) - Video learning interface
- **Profile** (`/profile`) - User profile and progress statistics

### Components Created

#### Layout Components
- `AppLayout` - Main layout with left sidebar support

#### Sidebar Components
- `SubjectSidebar` - Fetches and displays subject tree structure
- `SectionItem` - Renders sections and videos with status icons (completed, locked, play)

#### Video Components
- `VideoPlayer` - YouTube embed with progress tracking
- `VideoMeta` - Video title and description display
- `VideoProgressBar` - Visual progress indicator

#### UI Components
- `Button` - Reusable button with variants
- `Spinner` - Loading spinner in multiple sizes
- `Alert` - Notification component for errors/success

### State Management (Zustand)

#### authStore
- Manages user authentication state
- Persists tokens in localStorage
- Provides login, logout, and refresh functions

#### videoStore
- Tracks current video state
- Manages playback position and duration
- Stores next/previous video IDs for navigation

#### sidebarStore
- Fetches subject tree from API
- Manages loading and error states
- Updates video completion status

### API Client Features

The axios client includes:
- Automatic Authorization header attachment
- 401 response handling
- Automatic token refresh mechanism
- Request queuing during refresh
- Retry logic for failed requests

### Progress Tracking

- Sends progress every 10 seconds to backend
- Automatically marks video as completed on finish
- Navigates to next video after completion
- Restores last watched position on reload

## 🚀 How to Run

### Option 1: Development Server (Already Running)

The development server is currently running at:
**http://localhost:5173**

You can click the preview button to view it.

### Option 2: Manual Start

```bash
cd frontend
npm run dev
```

## ⚙️ Configuration

### Update Backend URL

Edit the `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=https://your-backend-url/api
```

Replace `https://your-backend-url/api` with your actual backend API URL.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── main.tsx                    # Entry point
│   ├── App.tsx                     # Main app component
│   ├── routes/
│   │   ├── Router.tsx              # Route configuration
│   │   └── ProtectedRoute.tsx      # Auth guard
│   ├── pages/
│   │   ├── Home.tsx                # Subject list
│   │   ├── Login.tsx               # Login form
│   │   ├── Register.tsx            # Registration form
│   │   ├── SubjectPage.tsx         # Subject detail
│   │   ├── VideoPage.tsx           # Video player
│   │   └── Profile.tsx             # User profile
│   ├── components/
│   │   ├── Layout/
│   │   │   └── AppLayout.tsx       # Main layout
│   │   ├── Sidebar/
│   │   │   ├── SubjectSidebar.tsx  # Subject sidebar
│   │   │   └── SectionItem.tsx     # Section renderer
│   │   ├── Video/
│   │   │   ├── VideoPlayer.tsx     # YouTube player
│   │   │   ├── VideoMeta.tsx       # Video info
│   │   │   └── VideoProgressBar.tsx # Progress bar
│   │   └── UI/
│   │       ├── Button.tsx          # Button component
│   │       ├── Spinner.tsx         # Loading spinner
│   │       └── Alert.tsx           # Alerts
│   ├── stores/
│   │   ├── authStore.ts            # Auth state
│   │   ├── videoStore.ts           # Video state
│   │   └── sidebarStore.ts         # Sidebar state
│   └── services/
│       └── apiClient.ts            # Axios client
├── .env                            # Environment variables
├── package.json
├── tailwind.config.js
├── vite.config.js
└── vercel.json                     # Vercel config
```

## 🔧 Next Steps

### 1. Update Backend URL
Update `VITE_API_BASE_URL` in `.env` with your backend URL.

### 2. Test Authentication Flow
- Navigate to `/register` to create an account
- Login with credentials
- Verify tokens are stored in localStorage

### 3. Test Video Playback
- Navigate to a subject
- Click on a video
- Watch the progress tracking in action
- Check if completion updates the sidebar

### 4. Deploy to Vercel

```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy
vercel
```

Or push to GitHub and import the repository in Vercel dashboard.

## 🎯 API Endpoints Expected

Your backend should provide these endpoints:

### Authentication
- `POST /auth/login` - Returns `{ user, accessToken, refreshToken }`
- `POST /auth/register` - Returns `{ user, accessToken, refreshToken }`
- `POST /auth/refresh` - Returns `{ accessToken, refreshToken }`

### Subjects
- `GET /subjects` - Returns array of subjects
- `GET /subjects/:subjectId/tree` - Returns subject tree with sections and videos

### Videos
- `GET /videos/:videoId` - Returns video details including `youtubeVideoId`
- `POST /progress/videos/:videoId` - Accepts `{ last_position_seconds, is_completed? }`

### Profile
- `GET /profile/stats` - Returns `{ videosCompleted, totalWatchTimeMinutes, subjectsEnrolled }`

## 🎨 Features Implemented

✅ React + Vite + TypeScript setup
✅ TailwindCSS styling
✅ React Router with protected routes
✅ Zustand state management
✅ Axios with automatic token refresh
✅ YouTube video embedding
✅ Progress tracking every 10 seconds
✅ Video completion handling
✅ Auto-navigation to next video
✅ Responsive sidebar with sections
✅ Loading states and error handling
✅ Authentication flow (login/register/logout)
✅ User profile with statistics
✅ Ready for Vercel deployment

## 📝 Notes

- The application uses TypeScript for type safety
- All components are modular and reusable
- The code follows React best practices
- State management is centralized using Zustand
- The app is production-ready and deployable

## 🆘 Troubleshooting

### Application won't start
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### API calls failing
- Check that `VITE_API_BASE_URL` is correctly set in `.env`
- Ensure your backend server is running
- Check browser console for CORS issues

### Build errors
```bash
npm run build
```
Check the error output and fix any TypeScript or import issues.

---

**Happy Coding! 🎉**
