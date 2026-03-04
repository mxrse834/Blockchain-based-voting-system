# Comprehensive API Documentation

## Authentication Endpoints

### 1. Register User
**Endpoint**: `POST /auth/register`  
**Authentication**: None  
**Description**: Create a new user account

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response** (201):
```json
{
  "statusCode": 201,
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "VOTER",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "User registered successfully"
}
```

**Error Response** (400/409):
```json
{
  "statusCode": 400,
  "message": "Password must be at least 6 characters"
}
```

**Validation Rules**:
- Name: Required, non-empty
- Email: Required, valid email format, unique
- Password: Required, minimum 6 characters

**Notes**:
- New users are assigned VOTER role by default
- Email must be unique in system
- Password is hashed using bcrypt (10 rounds)

---

### 2. Login User
**Endpoint**: `POST /auth/login`  
**Authentication**: None  
**Description**: Authenticate user and get tokens

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response** (200):
```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "VOTER",
      "created_at": "2024-01-15T10:30:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

**Error Response** (401):
```json
{
  "statusCode": 401,
  "message": "Invalid email or password"
}
```

**Token Details**:
- Access Token: JWT token with 15-minute expiry
- Refresh Token: Sent as HTTP-only cookie with 7-day expiry
- Include access token in `Authorization: Bearer <token>` header

---

### 3. Logout User
**Endpoint**: `POST /auth/logout`  
**Authentication**: Required (Bearer token)  
**Description**: End user session

**Request Headers**:
```
Authorization: Bearer <accessToken>
```

**Success Response** (200):
```json
{
  "statusCode": 200,
  "data": null,
  "message": "Logged out successfully"
}
```

**Notes**:
- Clears refresh token cookie
- Access token becomes invalid after logout
- Frontend should clear stored tokens

---

### 4. Get Current User
**Endpoint**: `GET /auth/me`  
**Authentication**: Required (Bearer token)  
**Description**: Get authenticated user information

**Request Headers**:
```
Authorization: Bearer <accessToken>
```

**Success Response** (200):
```json
{
  "statusCode": 200,
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "VOTER",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "User retrieved successfully"
}
```

**Error Response** (401):
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

---

### 5. Refresh Access Token
**Endpoint**: `POST /auth/refresh-token`  
**Authentication**: Cookie-based (refreshToken)  
**Description**: Get new access token using refresh token

**Request Body** (optional, for non-cookie refresh):
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response** (200):
```json
{
  "statusCode": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Access token refreshed successfully"
}
```

**Error Response** (401):
```json
{
  "statusCode": 401,
  "message": "Invalid or expired refresh token"
}
```

---

## Election Endpoints

### 1. Create Election (Admin Only)
**Endpoint**: `POST /elections`  
**Authentication**: Required (Bearer token)  
**Authorization**: ADMIN role  
**Description**: Create a new election

**Request Headers**:
```
Authorization: Bearer <adminToken>
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "Presidential Elections 2024",
  "startTime": "2024-12-01T10:00:00Z",
  "endTime": "2024-12-01T18:00:00Z"
}
```

**Success Response** (201):
```json
{
  "statusCode": 201,
  "data": {
    "election_id": "660e8400-e29b-41d4-a716-446655440001",
    "title": "Presidential Elections 2024",
    "start_time": "2024-12-01T10:00:00Z",
    "end_time": "2024-12-01T18:00:00Z",
    "status": "UPCOMING",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "Election created successfully"
}
```

**Validation**:
- Title: Required, non-empty
- Start Time: Required, valid ISO 8601 format
- End Time: Required, must be after start time
- Status auto-determined based on current time

---

### 2. Get All Elections
**Endpoint**: `GET /elections`  
**Authentication**: Required (Bearer token)  
**Description**: List all elections

**Request Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters** (optional):
- `status`: Filter by status (UPCOMING, ACTIVE, CLOSED)
- `limit`: Maximum results (default: 100)
- `offset`: Pagination offset (default: 0)

**Success Response** (200):
```json
{
  "statusCode": 200,
  "data": [
    {
      "election_id": "660e8400-e29b-41d4-a716-446655440001",
      "title": "Presidential Elections 2024",
      "start_time": "2024-12-01T10:00:00Z",
      "end_time": "2024-12-01T18:00:00Z",
      "status": "UPCOMING",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "message": "All elections fetched successfully"
}
```

---

### 3. Get Election by ID
**Endpoint**: `GET /elections/:electionId`  
**Authentication**: Required (Bearer token)  
**Description**: Get election details

**Request Headers**:
```
Authorization: Bearer <token>
```

**URL Parameters**:
- `electionId`: Election UUID (required)

**Success Response** (200):
```json
{
  "statusCode": 200,
  "data": {
    "election_id": "660e8400-e29b-41d4-a716-446655440001",
    "title": "Presidential Elections 2024",
    "start_time": "2024-12-01T10:00:00Z",
    "end_time": "2024-12-01T18:00:00Z",
    "status": "ACTIVE",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "Election fetched successfully"
}
```

**Error Response** (404):
```json
{
  "statusCode": 404,
  "message": "Election does not exist"
}
```

---

### 4. Update Election (Admin Only)
**Endpoint**: `PATCH /elections/:electionId`  
**Authentication**: Required (Bearer token)  
**Authorization**: ADMIN role  
**Description**: Update election details

**Request Body** (at least one field required):
```json
{
  "title": "Presidential Elections 2024 - Updated",
  "startTime": "2024-12-01T09:00:00Z",
  "endTime": "2024-12-01T19:00:00Z",
  "status": "ACTIVE"
}
```

**Success Response** (200):
```json
{
  "statusCode": 200,
  "data": {
    "election_id": "660e8400-e29b-41d4-a716-446655440001",
    "title": "Presidential Elections 2024 - Updated",
    "start_time": "2024-12-01T09:00:00Z",
    "end_time": "2024-12-01T19:00:00Z",
    "status": "ACTIVE",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "Election updated successfully"
}
```

---

### 5. Delete Election (Admin Only)
**Endpoint**: `DELETE /elections/:electionId`  
**Authentication**: Required (Bearer token)  
**Authorization**: ADMIN role  
**Description**: Delete election and associated data

**Success Response** (200):
```json
{
  "statusCode": 200,
  "data": null,
  "message": "Election deleted successfully"
}
```

**Notes**:
- Deletes election and all associated candidates, votes
- Cannot be undone

---

## Candidate Endpoints

### 1. Get Candidates
**Endpoint**: `GET /elections/:electionId/candidates`  
**Authentication**: Required (Bearer token)  
**Description**: List all candidates in an election

**Success Response** (200):
```json
{
  "statusCode": 200,
  "data": [
    {
      "candidate_id": "770e8400-e29b-41d4-a716-446655440002",
      "name": "Candidate A",
      "election_id": "660e8400-e29b-41d4-a716-446655440001"
    },
    {
      "candidate_id": "880e8400-e29b-41d4-a716-446655440003",
      "name": "Candidate B",
      "election_id": "660e8400-e29b-41d4-a716-446655440001"
    }
  ],
  "message": "Candidates fetched successfully"
}
```

---

### 2. Add Candidate (Admin Only)
**Endpoint**: `POST /elections/:electionId/candidates`  
**Authentication**: Required (Bearer token)  
**Authorization**: ADMIN role  
**Description**: Add new candidate to election

**Request Body**:
```json
{
  "name": "Candidate A"
}
```

**Success Response** (201):
```json
{
  "statusCode": 201,
  "data": {
    "candidate_id": "770e8400-e29b-41d4-a716-446655440002",
    "name": "Candidate A",
    "election_id": "660e8400-e29b-41d4-a716-446655440001"
  },
  "message": "Candidate added successfully"
}
```

**Error Responses**:
```json
{
  "statusCode": 409,
  "message": "Candidate already exists in this election"
}
```

---

### 3. Delete Candidate (Admin Only)
**Endpoint**: `DELETE /elections/:electionId/candidates/:candidateId`  
**Authentication**: Required (Bearer token)  
**Authorization**: ADMIN role  
**Description**: Remove candidate from election

**Success Response** (200):
```json
{
  "statusCode": 200,
  "data": null,
  "message": "Candidate deleted successfully"
}
```

---

## Voting Endpoints

### 1. Cast Vote
**Endpoint**: `POST /votes/:electionId`  
**Authentication**: Required (Bearer token)  
**Description**: Cast vote for a candidate

**Request Body**:
```json
{
  "candidateId": "770e8400-e29b-41d4-a716-446655440002",
  "onchainIndex": 0
}
```

**Success Response** (201):
```json
{
  "statusCode": 201,
  "data": {
    "candidateId": "770e8400-e29b-41d4-a716-446655440002",
    "onchain": {
      "txHash": "0x1234...",
      "blockNumber": 12345
    }
  },
  "message": "Vote cast successfully"
}
```

**Error Responses**:
```json
{
  "statusCode": 409,
  "message": "You have already voted in this election"
}
```

**Validation**:
- Can only vote during election active period
- One vote per user per election
- Candidate must exist in election

---

### 2. Get Election Results
**Endpoint**: `GET /votes/:electionId/results`  
**Authentication**: Required (Bearer token)  
**Description**: Get voting results

**Success Response** (200):
```json
{
  "statusCode": 200,
  "data": [
    {
      "candidate_id": "770e8400-e29b-41d4-a716-446655440002",
      "name": "Candidate A",
      "vote_count": 150,
      "vote_percent": 50.5
    },
    {
      "candidate_id": "880e8400-e29b-41d4-a716-446655440003",
      "name": "Candidate B",
      "vote_count": 147,
      "vote_percent": 49.5
    }
  ],
  "message": "Election results fetched successfully"
}
```

**Notes**:
- Returns candidates sorted by vote count (descending)
- Includes vote percentages
- Available after voting starts or election closes

---

### 3. Get My Vote
**Endpoint**: `GET /votes/:electionId/my-vote`  
**Authentication**: Required (Bearer token)  
**Description**: Get user's vote in election

**Success Response (Voted)** (200):
```json
{
  "statusCode": 200,
  "data": {
    "candidate_id": "770e8400-e29b-41d4-a716-446655440002",
    "name": "Candidate A"
  },
  "message": "Vote fetched successfully"
}
```

**Success Response (Not Voted)** (200):
```json
{
  "statusCode": 200,
  "data": null,
  "message": "Vote fetched successfully"
}
```

---

## Error Handling

### Standard Error Responses

**400 - Bad Request**
```json
{
  "statusCode": 400,
  "message": "All fields are required"
}
```

**401 - Unauthorized**
```json
{
  "statusCode": 401,
  "message": "Unauthorized request"
}
```

**403 - Forbidden**
```json
{
  "statusCode": 403,
  "message": "Access denied"
}
```

**404 - Not Found**
```json
{
  "statusCode": 404,
  "message": "Resource not found"
}
```

**409 - Conflict**
```json
{
  "statusCode": 409,
  "message": "Resource already exists"
}
```

**500 - Server Error**
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## Authentication Headers

All authenticated requests require:
```
Authorization: Bearer <accessToken>
```

Example with cURL:
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
     http://localhost:5000/auth/me
```

---

## Rate Limiting

Current implementation has no rate limiting. Recommended for production:
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## CORS Configuration

Ensure backend allows frontend origin:
```javascript
// Recommended CORS settings
{
  origin: ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```
