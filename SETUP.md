# Blockchain-Based Voting System - Setup Guide

Complete end-to-end setup instructions for running the blockchain-based voting system.

## System Architecture

- **Backend**: Node.js + Express (Port 5000)
- **Frontend**: React 18 + Vite (Port 3000)
- **Database**: MySQL (Port 3306)
- **Blockchain**: Solidity Smart Contracts

---

## Prerequisites

- **Node.js** v16+ and npm
- **MySQL** Server 8.0+
- **Git** (optional)

---

## STEP 1: Database Setup

### 1.1 Create MySQL Database

```bash
mysql -u root -p
```

Enter your MySQL password when prompted.

### 1.2 Run Schema

Copy the entire contents of `backend/database/schema.sql` and paste into the MySQL shell:

```sql
-- Copy-paste the entire schema.sql file here
```

Or run via command line:

```bash
mysql -u root -p voting_system < backend/database/schema.sql
```

### 1.3 Verify Tables Created

```sql
USE voting_system;
SHOW TABLES;
```

You should see:
- `users`
- `elections`
- `candidates`
- `voting_status`

---

## STEP 2: Backend Setup

### 2.1 Navigate to Backend

```bash
cd backend
```

### 2.2 Install Dependencies

```bash
npm install
```

### 2.3 Verify .env File

Check that `backend/.env` exists with the following variables:

```env
PORT=5000
FRONTEND_URL=http://localhost:3000
ACCESS_TOKEN_SECRET=dsugfobKFJGJBlihfpfwUIafsgefj2gsuibfwdf_sdfuigqnc97c3_IUADUDFVA!c3ugci1boh1cFV_1cugug
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=akjfguweougf_UYc_sfugworoubVisfhjbVviKHViiyKVKgiougvGOIgougo
REFRESH_TOKEN_EXPIRY=1d
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root123
DB_NAME=voting_system
DB_PORT=3306
```

**⚠️ Note**: In production, change JWT secrets to secure random strings!

### 2.4 Populate Test Data

Run the seed script to add test users and elections:

```bash
node database/seed.js
```

Expected output:
```
✓ Admin user created
✓ Voter user created
✓ Election 1 created
✓ Election 2 created
✓ Candidates for Election 1 created
✓ Candidates for Election 2 created

✅ Database seeding completed successfully!

Test Credentials:
Admin:
  Email: admin@test.com
  Password: admin123456
Voter:
  Email: voter@test.com
  Password: voter123456
```

### 2.5 Start Backend

```bash
npm run dev
```

Expected output:
```
Blockchain service initialized
Server running on port 5000
MySQL Database connected
```

✅ **Backend is running on `http://localhost:5000`**

---

## STEP 3: Frontend Setup

### 3.1 Navigate to Frontend

Open a new terminal and run:

```bash
cd Frontend
```

### 3.2 Install Dependencies

```bash
npm install
```

### 3.3 Verify .env File

Check that `Frontend/.env` exists:

```env
VITE_API_URL=http://localhost:5000
```

### 3.4 Start Frontend

```bash
npm run dev
```

Expected output:
```
  VITE v8.0.1  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

✅ **Frontend is running on `http://localhost:3000`**

---

## STEP 4: Access the Application

### Landing Page
- Open: `http://localhost:3000`
- Click "Cast your vote" or "Admin portal" buttons

### Test Credentials

#### Admin Account
- **Email**: admin@test.com
- **Password**: admin123456

Access admin dashboard to:
- View all elections
- Create new elections
- Manage candidates for elections
- Delete elections

#### Voter Account
- **Email**: voter@test.com
- **Password**: voter123456

Access voter dashboard to:
- View available elections
- Filter elections by status (Upcoming, Active, Closed)
- Cast votes in active elections
- View election results in closed elections

---

## API Endpoints

### Authentication
- `POST /auth/register` — Register new voter
- `POST /auth/login` — Login (returns accessToken)
- `POST /auth/logout` — Logout
- `GET /auth/me` — Get current user (requires JWT)
- `POST /auth/refresh-token` — Refresh access token

### Elections
- `GET /elections` — Get all elections (requires JWT)
- `GET /elections/:electionId` — Get election details (requires JWT)
- `POST /elections` — Create election (Admin only)
- `PATCH /elections/:electionId` — Update election (Admin only)
- `DELETE /elections/:electionId` — Delete election (Admin only)

### Candidates
- `GET /elections/:electionId/candidates` — Get candidates (requires JWT)
- `POST /elections/:electionId/candidates` — Add candidate (Admin only)
- `DELETE /elections/:electionId/candidates/:candidateId` — Delete candidate (Admin only)

### Votes
- `POST /votes/:electionId` — Cast vote (requires JWT)
- `GET /votes/:electionId/results` — Get election results (requires JWT)
- `GET /votes/:electionId/my-vote` — Get authenticated user's vote (requires JWT)

---

## Frontend Pages

1. **Home** (`/`) — Landing page, no auth required
2. **Login** (`/login`) — User login page
3. **Register** (`/register`) — User registration page
4. **Voter Elections** (`/voter-elections`) — List of elections for voters (requires VOTER role)
5. **Voting Page** (`/voting/:electionId`) — Cast vote page (requires VOTER role)
6. **Election Results** (`/results/:electionId`) — View election results (requires VOTER role)
7. **Admin Elections** (`/admin-elections`) — Admin election management (requires ADMIN role)
8. **Create Election** (`/create-election`) — Create new election (requires ADMIN role)
9. **Admin Election Detail** (`/admin-election-detail/:electionId`) — Manage candidates (requires ADMIN role)

---

## Features Implemented

### Backend Features
✅ JWT-based authentication (Access & Refresh tokens)
✅ Role-based access control (ADMIN, VOTER)
✅ CORS configured for frontend communication
✅ Election CRUD operations
✅ Candidate management per election
✅ Voting mechanism with vote recording
✅ Election results calculation
✅ Error handling middleware
✅ Request validation

### Frontend Features
✅ Protected routes with role-based access
✅ Context-based authentication state management
✅ Automatic session restoration on page reload
✅ Token refresh interceptor
✅ Real-time election status filtering
✅ Candidate selection interface
✅ Results visualization
✅ Admin dashboard for election management

---

## Troubleshooting

### Backend Issues

**Error: "MySQL connection failed"**
- Verify MySQL is running
- Check DB_HOST, DB_USER, DB_PASSWORD in `.env`
- Ensure database `voting_system` exists

**Error: "Port 5000 already in use"**
- Change PORT in `.env` or kill the process on port 5000
- Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`
- Mac/Linux: `lsof -i :5000` then `kill -9 <PID>`

**Error: "Cannot find module 'cors'"**
- Run `npm install` in backend directory

### Frontend Issues

**Error: "VITE_API_URL is undefined"**
- Verify `Frontend/.env` contains `VITE_API_URL=http://localhost:5000`
- Restart frontend dev server: `npm run dev`

**Error: "API calls return 401 Unauthorized"**
- Ensure backend is running on port 5000
- Check that accessToken is stored in localStorage
- Try logging in again

**Error: "Port 3000 already in use"**
- Change port in `vite.config.js`
- Or kill process: Windows `netstat -ano | findstr :3000`

### Database Issues

**Error: "Unknown database 'voting_system'"**
- Run schema.sql first: `mysql -u root -p < backend/database/schema.sql`

**Error: "Seed data already exists"**
- The seed script checks for duplicates by email; unique constraint prevents re-insertion
- To reset, delete users and elections manually or recreate the database

---

## Production Deployment

### Before Deploying:

1. **Change JWT Secrets**
   ```env
   ACCESS_TOKEN_SECRET=your-secure-random-string-here
   REFRESH_TOKEN_SECRET=your-secure-random-string-here
   ```

2. **Set NODE_ENV to production**
   ```env
   NODE_ENV=production
   ```

3. **Update FRONTEND_URL**
   ```env
   FRONTEND_URL=your-production-domain.com
   ```

4. **Enable HTTPS** in production

5. **Use environment-specific database credentials**

6. **Build frontend**
   ```bash
   cd Frontend
   npm run build
   ```

---

## File Structure Summary

```
Blockchain-based-voting-system/
├── backend/
│   ├── .env                          # Environment variables
│   ├── server.js                     # Main entry point
│   ├── package.json                  # Dependencies
│   ├── database/
│   │   ├── schema.sql               # Database schema
│   │   ├── seed.sql                 # SQL seed data
│   │   └── seed.js                  # Node.js seed script
│   └── src/
│       ├── config/
│       │   └── db.config.js         # DB configuration
│       ├── controllers/              # Route handlers
│       ├── routes/                   # API routes
│       ├── middlewares/              # Auth/error handlers
│       ├── models/                   # Data models
│       └── utils/                    # Utilities (API response, error, tokens)
│
├── Frontend/
│   ├── .env                          # Environment variables
│   ├── package.json                  # Dependencies
│   ├── vite.config.js               # Vite configuration
│   ├── index.html                    # HTML entry point
│   └── src/
│       ├── main.jsx                  # React entry point
│       ├── App.jsx                   # App component with routing
│       ├── api/
│       │   └── api.js               # Axios instance & interceptors
│       ├── context/
│       │   └── AuthContext.jsx       # Authentication context
│       └── Pages/                    # Page components (9 pages)
│           ├── Home.jsx
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── VoterElections.jsx
│           ├── VotingPage.jsx
│           ├── ElectionResults.jsx
│           ├── AdminElections.jsx
│           ├── CreateElection.jsx
│           └── AdminElectionDetail.jsx
│
└── Blockchain/                       # Smart contracts (Solidity)
    ├── contracts/
    └── SecureVoting.sol
```

---

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Verify all ports (3000, 5000, 3306) are available
3. Ensure all dependencies are installed
4. Check console for error messages
5. Review the API response in browser DevTools

---

## Changed Files Summary

### Created/Modified Files:

**Backend:**
- ✅ `server.js` — Added CORS, error handler, removed standalone candidates route
- ✅ `package.json` — Added cors dependency, added start script
- ✅ `.env` — Created with all required variables
- ✅ `src/routes/election.routes.js` — Added nested candidate routes
- ✅ `src/controllers/candidates.controller.js` — Updated response format
- ✅ `database/schema.sql` — Created comprehensive schema
- ✅ `database/seed.sql` — Created SQL seed data
- ✅ `database/seed.js` — Created Node.js seed script

**Frontend:**
- ✅ `.env` — Created with VITE_API_URL
- ✅ `package.json` — Added axios dependency
- ✅ `vite.config.js` — Set port to 3000
- ✅ `src/App.jsx` — Complete routing with AuthProvider and ProtectedRoutes
- ✅ `src/main.jsx` — No changes needed
- ✅ `src/context/AuthContext.jsx` — Created auth context
- ✅ `src/api/api.js` — Created Axios instance with interceptors
- ✅ `src/Pages/Home.jsx` — Updated landing page
- ✅ `src/Pages/Login.jsx` — Created login page
- ✅ `src/Pages/Register.jsx` — Created registration page
- ✅ `src/Pages/VoterElections.jsx` — Created voter elections list
- ✅ `src/Pages/VotingPage.jsx` — Created voting interface
- ✅ `src/Pages/ElectionResults.jsx` — Created results view
- ✅ `src/Pages/AdminElections.jsx` — Created admin elections management
- ✅ `src/Pages/CreateElection.jsx` — Created election creation form
- ✅ `src/Pages/AdminElectionDetail.jsx` — Created candidate management

**Root:**
- ✅ `SETUP.md` — Created this comprehensive setup guide

---

**Status**: ✅ System is now fully functional end-to-end!

Last Updated: 2024
