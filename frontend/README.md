# Blockchain Voting System - Frontend

A modern, responsive React.js frontend for a blockchain-based secure voting system with end-to-end encrypted voting and blockchain immutability.

## Features

### 🔐 Security & Authentication
- JWT-based authentication with access token refresh
- Secure password hashing
- Protected routes with role-based access control (RBAC)
- Automatic token refresh on 401 responses

### 🗳️ Voter Features
- Browse all available elections
- Filter elections by status (Active, Upcoming, Closed)
- Cast votes securely in active elections
- View election results
- Track voting history

### 👨‍💼 Admin Features
- Create and manage elections
- Set election start and end times
- Add and remove candidates
- View real-time election results
- Delete elections
- Monitor voting progress

### 🎨 User Experience
- Clean, intuitive interface
- Responsive design for mobile and desktop
- Real-time status indicators
- Comprehensive form validation
- Alert notifications for user actions
- Loading states and error handling

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Styling**: CSS3 with CSS Variables
- **Package Manager**: npm

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── api.js                 # Axios instance with interceptors
│   ├── components/
│   │   ├── Alert.jsx               # Alert notification component
│   │   ├── Alert.css
│   │   ├── Navbar.jsx              # Navigation bar
│   │   ├── Navbar.css
│   │   ├── LoadingSpinner.jsx       # Loading indicator
│   │   ├── LoadingSpinner.css
│   │   └── ProtectedRoute.jsx       # Route protection wrapper
│   ├── context/
│   │   └── AuthContext.jsx          # Authentication context
│   ├── pages/
│   │   ├── Home.jsx                 # Home page
│   │   ├── Home.css
│   │   ├── Login.jsx                # Login page
│   │   ├── Register.jsx             # Registration page
│   │   ├── Auth.css
│   │   ├── VoterElections.jsx       # Voter elections list
│   │   ├── VoterElections.css
│   │   ├── VotingPage.jsx           # Voting interface
│   │   ├── VotingPage.css
│   │   ├── ElectionResults.jsx      # Results display
│   │   ├── ElectionResults.css
│   │   ├── AdminElections.jsx       # Admin elections list
│   │   ├── AdminElections.css
│   │   ├── CreateElection.jsx       # Election creation form
│   │   ├── CreateElection.css
│   │   ├── AdminElectionDetail.jsx  # Election management
│   │   └── AdminElectionDetail.css
│   ├── App.jsx                      # Main app component with routing
│   ├── App.css
│   ├── index.css                    # Global styles
│   └── main.jsx                     # React entry point
├── index.html                       # HTML template
├── vite.config.js                   # Vite configuration
├── package.json                     # Dependencies and scripts
└── README.md                        # This file
```

## Installation

### Prerequisites
- Node.js 16+ and npm 8+
- Backend running on `http://localhost:5000`

### Setup Steps

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Update environment variables if needed**
```
VITE_API_BASE_URL=http://localhost:5000
```

## Running the Development Server

Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Advanced Development Features

### API Interceptors
- Automatic token-based authentication
- Automatic token refresh on expiration
- Redirect to login on 401 Unauthorized
- Credential inclusion for HTTP-only cookies

### Context API
The authentication context manages:
- User state and authentication status
- Token storage in localStorage
- All authentication operations (register, login, logout)
- Role-based access control

### Protected Routes
Routes can require:
- Authentication (all protected routes)
- Specific role (admin-only routes)
- Automatic redirect to login if accessed without auth

## API Endpoints Used

### Authentication
```
POST   /auth/register              - Register new user
POST   /auth/login                 - Login user
POST   /auth/logout                - Logout user (requires auth)
POST   /auth/refresh-token         - Refresh access token
GET    /auth/me                    - Get current user (requires auth)
```

### Elections
```
GET    /elections                  - Get all elections (requires auth)
GET    /elections/:electionId      - Get election details (requires auth)
POST   /elections                  - Create election (admin only)
PATCH  /elections/:electionId      - Update election (admin only)
DELETE /elections/:electionId      - Delete election (admin only)
```

### Candidates
```
GET    /elections/:electionId/candidates              - Get candidates
POST   /elections/:electionId/candidates              - Add candidate (admin)
DELETE /elections/:electionId/candidates/:candidateId - Remove candidate (admin)
```

### Voting
```
POST   /votes/:electionId          - Cast vote (voter)
GET    /votes/:electionId/results  - Get results (voter/admin)
GET    /votes/:electionId/my-vote  - Get user's vote (voter)
```

## Features Explanation

### Authentication Flow
1. User registers or logs in
2. Backend returns JWT access token and refresh token
3. Access token stored in localStorage
4. Refresh token stored in HTTP-only cookie
5. All requests include Authorization header with token
6. Token automatically refreshed when expired

### Role-Based Access
- **ADMIN**: Can create, manage, and delete elections; add candidates
- **VOTER**: Can vote in active elections; view results

### Election Statuses
- **UPCOMING**: Voting hasn't started yet
- **ACTIVE**: Voting is currently open
- **CLOSED**: Voting has ended, results are final

### Voting Prevention Rules
- Cannot vote twice in same election
- Cannot vote before election starts
- Cannot vote after election ends
- Can only see results after voting or election closes

## Styling Guide

### CSS Variables
```css
--primary-color: #667eea
--secondary-color: #764ba2
--success-color: #10b981
--danger-color: #ef4444
--warning-color: #f59e0b
--text-dark: #1f2937
--text-light: #6b7280
```

### Responsive Breakpoints
- Mobile: < 480px
- Tablet: 480px - 768px
- Desktop: > 768px

All components are fully responsive with mobile-first approach.

## Error Handling

The frontend includes comprehensive error handling:
- API request validation
- Form input validation
- User-friendly error messages
- Automatic retry on token expiration
- Graceful fallbacks for missing data

## Performance Optimizations

- Code splitting via React Router
- Lazy loading of pages
- Efficient re-render prevention with Context
- CSS variables for theme consistency
- Optimized images and assets

## Building for Production

Create optimized production build:

```bash
npm run build
```

Build output will be in the `dist` directory.

Preview production build locally:

```bash
npm run preview
```

## Common Issues & Solutions

### Issue: Cannot connect to backend
**Solution**: Ensure backend is running on port 5000, check VITE_API_BASE_URL in .env

### Issue: Login redirects to login page
**Solution**: Check if token is being stored correctly in localStorage, verify JWT_SECRET matches backend

### Issue: 401 Unauthorized errors
**Solution**: Token may have expired, try clearing localStorage and logging in again

### Issue: CORS errors
**Solution**: Ensure backend has proper CORS configuration for http://localhost:3000

## Code Practices

### Component Structure
Each page component follows:
1. State initialization
2. useEffect for data fetching
3. Event handlers
4. Conditional rendering
5. Return JSX with proper CSS classes

### API Calls
All API calls:
- Use try-catch for error handling
- Set loading state before request
- Clear loading state in finally block
- Include appropriate error messages

### Form Validation
All forms:
- Validate on submit
- Show specific error messages
- Disable submit button during submission
- Provide visual feedback

## Future Enhancements

- [ ] Real-time election updates with WebSocket
- [ ] Export election results as PDF
- [ ] Email notifications for voting reminders
- [ ] Election analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Two-factor authentication
- [ ] Blockchain transaction verification UI

## Contributing

When adding new features:
1. Follow existing code structure
2. Use Context API for state management
3. Add responsive CSS for all breakpoints
4. Include proper error handling
5. Test on multiple devices

## License

This project is proprietary and confidential.

## Support

For issues and questions, contact the development team.
