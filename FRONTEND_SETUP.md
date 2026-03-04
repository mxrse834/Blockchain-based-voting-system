# Frontend Setup & Architecture Guide

Complete guide to understanding and running the React.js frontend for the Blockchain Voting System.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Installation](#installation)
4. [Project Structure](#project-structure)
5. [Components Documentation](#components-documentation)
6. [Pages Documentation](#pages-documentation)
7. [Context API](#context-api)
8. [Styling System](#styling-system)
9. [API Integration](#api-integration)
10. [State Management](#state-management)

## Overview

The frontend is a modern React.js application built with:
- **React 18**: Latest React version with hooks
- **Vite**: Next-generation build tool (faster than Create React App)
- **React Router v6**: Client-side routing
- **Axios**: HTTP client with request/response interceptors
- **Context API**: State management without Redux
- **CSS3**: Modern styling with CSS Variables

## Features

### Authentication
- ✅ User registration
- ✅ JWT-based login/logout
- ✅ Automatic token refresh
- ✅ Protected routes
- ✅ Role-based access control

### Voting System
- ✅ Browse elections by status
- ✅ Vote in active elections
- ✅ View election results
- ✅ One-vote-per-election enforcement
- ✅ Real-time vote counting

### Admin Panel
- ✅ Create elections
- ✅ Manage candidates
- ✅ Monitor voting progress
- ✅ Delete elections
- ✅ View detailed results

### User Experience
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Real-time status indicators
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states
- ✅ Toast notifications

## Installation

### Prerequisites

```bash
# Check Node.js version (should be 16+)
node --version

# Check npm version (should be 8+)
npm --version
```

### Step-by-Step Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Update .env if needed
# VITE_API_BASE_URL=http://localhost:5000

# 5. Start development server
npm run dev

# 6. Open browser to http://localhost:3000
```

## Project Structure

```
frontend/
│
├── src/
│   ├── api/
│   │   └── api.js                    # Axios HTTP client with interceptors
│   │
│   ├── components/
│   │   ├── Alert.jsx                 # Alert notifications
│   │   ├── Alert.css
│   │   ├── Navbar.jsx                # Navigation bar
│   │   ├── Navbar.css
│   │   ├── LoadingSpinner.jsx        # Loading spinner
│   │   ├── LoadingSpinner.css
│   │   ├── ProtectedRoute.jsx        # Route protection wrapper
│   │
│   ├── context/
│   │   └── AuthContext.jsx           # Authentication context
│   │
│   ├── pages/
│   │   ├── Home.jsx                  # Landing page
│   │   ├── Home.css
│   │   │
│   │   ├── Auth Pages/
│   │   ├── Login.jsx                 # Login page
│   │   ├── Register.jsx              # Registration page
│   │   ├── Auth.css
│   │   │
│   │   ├── Voter Pages/
│   │   ├── VoterElections.jsx        # Elections list for voters
│   │   ├── VoterElections.css
│   │   ├── VotingPage.jsx            # Voting interface
│   │   ├── VotingPage.css
│   │   │
│   │   ├── Admin Pages/
│   │   ├── AdminElections.jsx        # Elections list for admin
│   │   ├── AdminElections.css
│   │   ├── CreateElection.jsx        # Create election form
│   │   ├── CreateElection.css
│   │   ├── AdminElectionDetail.jsx   # Election management
│   │   ├── AdminElectionDetail.css
│   │   │
│   │   ├── Results/
│   │   ├── ElectionResults.jsx       # Results display
│   │   └── ElectionResults.css
│   │
│   ├── App.jsx                       # Main app with routing
│   ├── App.css
│   ├── index.css                     # Global styles
│   └── main.jsx                      # React entry point
│
├── public/                           # Static assets
├── index.html                        # HTML template
├── vite.config.js                    # Vite configuration
├── package.json                      # Dependencies
├── .env.example                      # Environment template
├── .gitignore                        # Git ignore file
└── README.md                         # Frontend README
```

## Components Documentation

### 1. Alert Component

**Location**: `src/components/Alert.jsx`

Displays notification messages to users.

**Props**:
```javascript
{
  type: 'success' | 'error' | 'warning' | 'info',  // Alert type
  message: string,                                  // Alert message
  onClose: () => void                              // Close handler
}
```

**Usage**:
```jsx
<Alert 
  type="success" 
  message="Operation completed successfully" 
  onClose={() => setAlert(null)}
/>
```

**Styles**:
- Success: Green background (#d1fae5)
- Error: Red background (#fee2e2)
- Warning: Yellow background (#fef3c7)
- Info: Blue background (#dbeafe)

---

### 2. Navbar Component

**Location**: `src/components/Navbar.jsx`

Navigation bar with responsive design.

**Features**:
- Logo and branding
- Dynamic menu based on authentication state
- Role-specific navigation links
- User profile display
- Logout button

**Links**:
- **Unauthenticated**: Login, Register
- **Voter**: Vote menu, Profile, Logout
- **Admin**: Elections, Create Election, Profile, Logout

---

### 3. LoadingSpinner Component

**Location**: `src/components/LoadingSpinner.jsx`

Displays loading indicator during data fetching.

**Props**:
```javascript
{
  message: string  // Optional loading message
}
```

**Usage**:
```jsx
<LoadingSpinner message="Loading elections..." />
```

---

### 4. ProtectedRoute Component

**Location**: `src/components/ProtectedRoute.jsx`

Wrapper for routes that require authentication.

**Props**:
```javascript
{
  children: ReactNode,      // Route content
  requiredRole?: string     // Optional: 'ADMIN' or 'VOTER'
}
```

**Usage**:
```jsx
<Route
  path="/admin/elections"
  element={
    <ProtectedRoute requiredRole="ADMIN">
      <AdminElections />
    </ProtectedRoute>
  }
/>
```

**Behavior**:
- Redirects unauthenticated users to /login
- Redirects users without required role to /
- Shows loading state while checking auth

---

## Pages Documentation

### Home Page

**Location**: `src/pages/Home.jsx`

Landing page with features and getting started information.

**Sections**:
1. Hero section with call-to-action buttons
2. Features showcase (Security, Transparency, Speed, Trust-less)
3. Information cards for voters and admins

**Routes**: `/`

---

### Login Page

**Location**: `src/pages/Login.jsx`

User authentication page.

**Form Fields**:
- Email (required, email format)
- Password (required)

**Features**:
- Form validation
- Error messages
- Loading state during submission
- Link to registration page
- Remember authentication on return visits

**Route**: `/login`

---

### Register Page

**Location**: `src/pages/Register.jsx`

User account creation page.

**Form Fields**:
- Name (required, non-empty)
- Email (required, valid format, unique)
- Password (required, min 6 characters)
- Confirm Password (must match password)

**Features**:
- Comprehensive validation
- Password match verification
- Error messages
- Success notification before redirect

**Route**: `/register`

---

### Voter Elections Page

**Location**: `src/pages/VoterElections.jsx`

Displays available elections for voters.

**Features**:
- Filter elections by status (All, Upcoming, Active, Closed)
- Election cards with details
- Quick action buttons
- Status color-coding

**Actions**:
- Active elections: "Vote Now" button
- Closed elections: "View Results" button
- Upcoming elections: "Coming Soon" label

**Route**: `/voter/elections`

---

### Voting Page

**Location**: `src/pages/VotingPage.jsx`

Voting interface for active elections.

**Features**:
- Candidate selection with visual feedback
- Real-time election status
- Vote submission
- Prevention of duplicate votes
- Results link after voting

**Candidate Display**:
- Numbered candidate cards
- Click to select
- Visual selection indicator
- Responsive grid layout

**Route**: `/voter/elections/:electionId/vote`

**Status Checks**:
- Voting not started: Shows warning
- Voting closed: Shows info message
- Already voted: Shows existing vote
- Can vote: Enables vote button

---

### Election Results Page

**Location**: `src/pages/ElectionResults.jsx`

Displays real-time voting results.

**Features**:
- Results summary (total votes, candidates count)
- Leading candidate highlighted
- Candidate rankings with vote counts
- Visual progress bars
- Vote percentages
- Last updated timestamp

**Route**: `/voter/elections/:electionId/results`

Also accessible via: `/admin/elections/:electionId/results`

---

### Admin Elections Page

**Location**: `src/pages/AdminElections.jsx`

Elections management interface for admins.

**Features**:
- Table view of all elections
- Status badges
- Election dates/times
- Action buttons (Manage, Results, Delete)
- Create new election button

**Actions**:
- Manage: Edit candidates
- Results: View detailed results
- Delete: Remove election

**Route**: `/admin/elections`

---

### Create Election Page

**Location**: `src/pages/CreateElection.jsx`

Form for creating new elections.

**Form Fields**:
- Title (required, non-empty)
- Start Time (required, datetime)
- End Time (required, must be after start)

**Features**:
- Date/time picker
- Validation
- Error messages
- Success notification
- Redirect after creation

**Route**: `/admin/create-election`

---

### Admin Election Detail Page

**Location**: `src/pages/AdminElectionDetail.jsx`

Election management interface.

**Features**:
- Election information display
- Current status and timing
- Candidate management section
- Add candidate form
- Candidate list with delete buttons
- View results button

**Actions**:
- Add candidates by name
- Remove candidates
- View election results
- Back to elections list

**Route**: `/admin/elections/:electionId`

---

## Context API

### AuthContext

**Location**: `src/context/AuthContext.jsx`

Manages authentication state and operations.

**Provider Props**:
```javascript
<AuthProvider>
  {children}
</AuthProvider>
```

**Context Value**:
```javascript
{
  user: {
    user_id: string,
    name: string,
    email: string,
    role: 'ADMIN' | 'VOTER',
    created_at: string
  } | null,
  loading: boolean,
  error: string | null,
  register: (name, email, password) => Promise,
  login: (email, password) => Promise,
  logout: () => Promise,
  getCurrentUser: () => Promise,
  isAuthenticated: boolean,
  isAdmin: boolean
}
```

**Usage**:
```jsx
const { user, login, logout, isAuthenticated, isAdmin } = useAuth();
```

**Methods**:

1. **register(name, email, password)**
   - Creates new user account
   - Returns user data
   - Stores to localStorage

2. **login(email, password)**
   - Authenticates user
   - Stores token in localStorage
   - Returns user data

3. **logout()**
   - Clears session
   - Removes stored tokens
   - Resets user state

4. **getCurrentUser()**
   - Fetches current user data
   - Updates context
   - Returns user data

---

## Styling System

### CSS Variables

**Location**: `src/index.css`

```css
/* Colors */
--primary-color: #667eea
--primary-dark: #5568d3
--secondary-color: #764ba2
--success-color: #10b981
--danger-color: #ef4444
--warning-color: #f59e0b

/* Backgrounds */
--light-bg: #f9fafb
--white: #ffffff

/* Text */
--text-dark: #1f2937
--text-light: #6b7280

/* Borders */
--border-color: #e5e7eb

/* Shadows */
--shadow: 0 1px 3px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1)
```

### Responsive Breakpoints

```css
/* Mobile First Approach */
/* Default: Mobile < 480px */
/* Tablet: 480px - 768px */
/* Desktop: > 768px */

@media (max-width: 480px) { /* Mobile styles */ }
@media (max-width: 768px) { /* Tablet styles */ }
```

### Component Styling Patterns

Each component has its own CSS file:
- Component logic in `.jsx` file
- Component styles in `.css` file
- Global styles in `src/index.css`

Example structure:
```
Button.jsx
Button.css
```

---

## API Integration

### HTTP Client Setup

**Location**: `src/api/api.js`

Axios instance with automatic authentication.

**Features**:
- Request interceptor: Adds authorization header
- Response interceptor: Handles token refresh
- Automatic error handling
- Credential inclusion

**Request Interceptor**:
```javascript
// Automatically adds token to requests
Authorization: Bearer <accessToken>
```

**Response Interceptor**:
- Detects 401 Unauthorized responses
- Attempts token refresh
- Retries original request
- Redirects to login on failure

**Usage**:
```javascript
import api from '../api/api'

const data = await api.get('/elections')
const result = await api.post('/votes/123', { candidateId: '456' })
await api.delete(`/elections/${id}`)
```

---

## State Management

### Local Storage

Persisted data:
- `accessToken`: JWT access token
- `user`: Authenticated user data

Automatically cleared on logout.

### Session Management

**Token Lifecycle**:
1. User logs in → receives access token + refresh token
2. Access token stored in localStorage
3. Refresh token stored in HTTP-only cookie
4. Token expires after 15 minutes
5. Automatic refresh extends session
6. Logout clears all tokens

**Automatic Refresh**:
- Triggered on 401 response
- Uses refresh token from cookie
- Updates access token
- Retries original request
- Redirects if refresh fails

---

## Development Workflow

### Running Development Server

```bash
npm run dev
```

Features:
- Hot Module Replacement (HMR)
- Fast refresh
- Source maps
- CORS proxy to backend

### Building for Production

```bash
npm run build
```

Creates optimized build in `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

Serves production build locally for testing.

---

## Debugging Tips

### 1. Check Console Logs
```javascript
// Enable request logging
console.log('Request:', config.method.toUpperCase(), config.url);
```

### 2. Browser DevTools
- Network tab: See all API calls
- Application tab: Check localStorage
- Console: Check for errors
- React DevTools: Component hierarchy

### 3. Common Issues

**Problem**: Login redirects to login page
```
Check:
1. localStorage has accessToken
2. API response includes token
3. Backend JWT_SECRET is correct
```

**Problem**: 404 on API calls
```
Check:
1. Backend is running on port 5000
2. Routes are registered
3. VITE_API_BASE_URL is correct
```

**Problem**: CORS errors
```
Check:
1. Backend CORS configuration
2. Allowed origins include localhost:3000
3. Credentials are set to true
```

---

## Performance Optimization

### Code Splitting
Routes are automatically split by React Router:
- Each page loads separately
- Smaller initial bundle
- Faster page load

### Lazy Loading
```javascript
const AdminElections = React.lazy(() => import('./pages/AdminElections'))
```

### Caching
- Election data cached in state
- Avoiding unnecessary API calls
- LocalStorage for auth tokens

### CSS Optimization
- CSS Variables for theming
- Minimal CSS duplication
- Mobile-first responsive design

---

## Security

### Authentication
- Tokens stored securely
- HTTP-only cookies for refresh tokens
- Automatic token validation

### Authorization
- Role-based route protection
- Admin-only operations
- Vote verification (one per election)

### Input Validation
- Form validation before submission
- Email format checking
- Password strength requirements
- Server-side validation confirmed

### API Safety
- All endpoints protected
- JWT validation on backend
- CORS configuration
- Input sanitization

---

## Deployment

### Build Production Ready Code
```bash
npm run build
```

### Deploy Frontend
Options:
1. **Vercel**: Automatic deployment from GitHub
2. **Netlify**: Similar to Vercel
3. **Traditional Server**: Copy `dist/` to web server
4. **Docker**: Containerize the application

### Environment Configuration
Update `.env` for production:
```
VITE_API_BASE_URL=https://api.yourdomain.com
```

---

## Best Practices

### Code Organization
- One component per file
- Separate CSS files
- Consistent naming conventions
- Modular structure

### Error Handling
- Try-catch blocks
- User-friendly messages
- Graceful fallbacks
- Error boundaries (future)

### Performance
- Minimize re-renders
- Use useEffect properly
- Lazy load images
- Optimize bundle size

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Color contrast

---

## Troubleshooting Guide

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `npm run dev -- --port 3001` |
| Dependencies error | `rm -rf node_modules && npm install` |
| CORS error | Check backend CORS settings |
| White screen | Check browser console for errors |
| Styles not loading | Hard refresh (Ctrl+F5) |
| API calls 404 | Verify backend routes |

---

## Getting Help

1. Check browser console (F12)
2. Check network requests
3. Review API documentation
4. Check backend logs
5. Refer to component documentation

---

## Next Steps

1. Customize styling to match branding
2. Add email notifications
3. Implement WebSocket for real-time updates
4. Add more analytics
5. Deploy to production

