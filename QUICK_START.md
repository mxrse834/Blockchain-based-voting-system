# Quick Start Guide - Blockchain Voting System

Get the voting system up and running in minutes!

## Prerequisites

- Node.js 16+ and npm 8+
- MySQL Server 5.7 or higher
- Git

## System Architecture

```
Frontend (React)          Backend (Node.js)         Database (MySQL)
http://localhost:3000  <-> http://localhost:5000 <-> localhost:3306
```

## Setup & Installation

### 1. Setup Database

**Create Database**
```bash
mysql -u root -p
```

```sql
CREATE DATABASE voting_system;
USE voting_system;
```

**Run Schema**
```sql
-- USERS TABLE
CREATE TABLE users (
  user_id CHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role ENUM('ADMIN', 'VOTER') NOT NULL DEFAULT 'VOTER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ELECTIONS TABLE
CREATE TABLE elections (
  election_id CHAR(36) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status ENUM('UPCOMING', 'ACTIVE', 'CLOSED') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- CANDIDATES TABLE
CREATE TABLE candidates (
  candidate_id CHAR(36) PRIMARY KEY,
  election_id CHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  FOREIGN KEY (election_id)
    REFERENCES elections(election_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- VOTES TABLE
CREATE TABLE votes (
  vote_id CHAR(36) PRIMARY KEY,
  election_id CHAR(36) NOT NULL,
  candidate_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_election (user_id, election_id),
  FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE,
  FOREIGN KEY (election_id)
    REFERENCES elections(election_id)
    ON DELETE CASCADE,
  FOREIGN KEY (candidate_id)
    REFERENCES candidates(candidate_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- VOTING_STATUS TABLE (optional, for blockchain integration)
CREATE TABLE voting_status (
  user_id CHAR(36) NOT NULL,
  election_id CHAR(36) NOT NULL,
  has_voted BOOLEAN DEFAULT FALSE,
  tx_hash TEXT,
  voted_at TIMESTAMP,
  PRIMARY KEY (user_id, election_id),
  FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE,
  FOREIGN KEY (election_id)
    REFERENCES elections(election_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;
```

### 2. Setup Backend

```bash
cd backend

# Create .env file
cat > .env << EOF
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=voting_system
JWT_SECRET=your_jwt_secret_key_change_this
REFRESH_TOKEN_SECRET=your_refresh_token_secret_change_this
ENABLE_ONCHAIN=false
EOF

# Install dependencies
npm install

# Start backend server
npm run dev
```

Expected output:
```
Server running on port 5000
Blockchain service initialized
```

### 3. Setup Frontend

**In another terminal:**

```bash
cd frontend

# Create .env file
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:5000
EOF

# Install dependencies
npm install

# Start development server
npm run dev
```

Expected output:
```
VITE v5.0.7  ready in 234 ms

➜  Local:   http://localhost:3000/
➜  press h to show help
```

## Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## First Time Usage

### Create Test Admin Account

Register with these credentials:
- **Email**: admin@test.com
- **Password**: admin123456
- **Name**: Admin User

**Note**: First user should be manually set as ADMIN in database:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@test.com';
```

### Create Test Voter Account

Register with:
- **Email**: voter@test.com
- **Password**: voter123456
- **Name**: Test Voter

## Using the Application

### Admin Workflow

1. **Login** as admin@test.com
2. **Create Election** → Click "Create Election"
   - Set title: "General Elections 2024"
   - Set start time: 2024-12-01 10:00
   - Set end time: 2024-12-01 18:00
3. **Manage Candidates** → Click "Manage" on election
   - Add candidates: Candidate A, Candidate B, Candidate C
4. **Monitor Results** → Click "Results" to view real-time voting

### Voter Workflow

1. **Login** as voter@test.com
2. **Browse Elections** → Click "Vote"
3. **Vote** → Select candidate and click "Cast Vote"
4. **View Results** → See election results after voting

## Project Structure

```
blockchain-voting-system/
├── backend/                 # Node.js Express server
│   ├── src/
│   │   ├── models/         # Database schemas
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API endpoints
│   │   ├── middlewares/    # Authentication & authorization
│   │   ├── utils/          # Utilities & blockchain
│   │   └── db/             # Database connection
│   ├── server.js           # Express setup
│   └── package.json
│
├── frontend/               # React application
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Auth context
│   │   ├── api/            # API client
│   │   ├── App.jsx         # Main app with routing
│   │   └── main.jsx        # React entry point
│   ├── index.html          # HTML template
│   ├── vite.config.js      # Vite configuration
│   └── package.json
│
└── Blockchain/             # Smart contracts
    ├── contracts/          # Solidity contracts
    ├── tests/              # Contract tests
    └── deploy/             # Deployment scripts
```

## API Endpoints Summary

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user

### Elections (Admin)
- `POST /elections` - Create election
- `GET /elections` - List all elections
- `GET /elections/:id` - Get election details
- `PATCH /elections/:id` - Update election
- `DELETE /elections/:id` - Delete election

### Candidates (Admin)
- `GET /elections/:id/candidates` - List candidates
- `POST /elections/:id/candidates` - Add candidate
- `DELETE /elections/:id/candidates/:candidateId` - Remove candidate

### Voting
- `POST /votes/:electionId` - Cast vote
- `GET /votes/:electionId/results` - Get results
- `GET /votes/:electionId/my-vote` - Get my vote

## Troubleshooting

### Backend Connection Issues

**Problem**: "Cannot connect to backend"
```
Solution:
1. Check if backend is running: http://localhost:5000
2. Verify .env file has correct database credentials
3. Ensure MySQL is running
```

### Database Connection Error

**Problem**: "ER_ACCESS_DENIED_FOR_USER"
```
Solution:
1. Verify MySQL credentials in .env
2. Ensure database exists: CREATE DATABASE voting_system;
3. Restart MySQL service
```

### Login Issues

**Problem**: "Invalid email or password"
```
Solution:
1. Register a new account first
2. Check email case sensitivity
3. Clear browser cookies if already registered
```

### Port Already in Use

**Problem**: "Address already in use :::3000" or ":::5000"
```bash
# Kill process on port 3000 (frontend)
# Windows PowerShell
taskkill /PID <PID> /F

# Or use different port
npm run dev -- --port 3001
```

## Development Tips

### Enable Console Logging

Edit `frontend/src/api/api.js` to see API requests:

```javascript
// Add after creating axios instance
api.interceptors.request.use((config) => {
  console.log('Request:', config.method.toUpperCase(), config.url);
  return config;
});
```

### Reset Database

```bash
mysql -u root -p voting_system < backend/src/models/schema.sql
```

### View Network Requests

Open browser DevTools → Network tab to see all API calls

## Performance Optimization

- Frontend caching: Results are cached in localStorage
- Database indexing: Queries are optimized with proper indexes
- JWT tokens: Access tokens have short expiry, refresh tokens for persistence

## Security Features

✅ Password hashing with bcrypt
✅ JWT-based authentication
✅ Role-based access control (RBAC)
✅ CORS configuration
✅ HTTP-only cookies for refresh tokens
✅ Input validation on all endpoints
✅ SQL injection prevention with parameterized queries

## Next Steps

1. **Read the full documentation**:
   - [Frontend README](frontend/README.md)
   - [Backend Implementation Guide](BACKEND_IMPLEMENTATION_GUIDE.md)

2. **Customize the application**:
   - Update branding/styling
   - Customize email templates
   - Configure blockchain integration

3. **Deploy**:
   - Set up production database
   - Deploy backend to server
   - Deploy frontend to CDN or hosting

## Support

For issues:
1. Check server console for error messages
2. Review browser DevTools (F12)
3. Check MySQL error logs
4. Review the documentation files

## License

Proprietary - All rights reserved
