# Blockchain-based Voting System

A decentralized voting platform.
## Tech Stack

- **Frontend**: React 18 + Vite + Recharts (for visualization)
- **Backend**: Node.js + Express + MySQL
- **Blockchain**: Solidity 0.8.19, Hardhat + ethers.js
- **Authentication**: JWT (access + refresh tokens)  
- **Wallet**: MetaMask integration

## Prerequisites

- Node.js 16+ and npm
- MySQL 8.0+
- MetaMask browser extension

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 2. Setup MySQL

```bash
mysql -u root -p
CREATE DATABASE voting_system;
SOURCE backend/database/schema.sql;
```

### 3. Configure Environment Variables

**Backend** (`backend/.env`):
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=voting_system
JWT_SECRET=long_random_string_here
REFRESH_TOKEN_SECRET=another_long_random_string
PORT=5000
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000
VITE_CONTRACT_ADDRESS=0x... (set after contract deployment)
```

## Running the System

**Terminal 1 - Local Blockchain:**
```bash
npm run chain
```

**Terminal 2 - Deploy Contract:**
```bash
npm run deploy
```

Copy contract address → update `frontend/.env` VITE_CONTRACT_ADDRESS

**Terminal 3 - Backend:**
```bash
cd backend && npm run dev
```

**Terminal 4 - Frontend:**
```bash
cd frontend && npm run dev
```

## Key Features

✅ JWT authentication with role-based access
✅ Dynamic election status (UPCOMING → ACTIVE → CLOSED)
✅ On-chain voting with MetaMask + MySQL database
✅ Real-time results visualization  
✅ Error boundary and countdown timers
✅ Confirmation modal for voting

## License

MIT
