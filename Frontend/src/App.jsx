import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import VoterElections from "./Pages/VoterElections";
import VotingPage from "./Pages/VotingPage";
import ElectionResults from "./Pages/ElectionResults";
import AdminElections from "./Pages/AdminElections";
import CreateElection from "./Pages/CreateElection";
import AdminElectionDetail from "./Pages/AdminElectionDetail";

function PrivateRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Voter routes */}
      <Route 
        path="/voter-elections" 
        element={
          <PrivateRoute requiredRole="VOTER">
            <VoterElections />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/voting/:electionId" 
        element={
          <PrivateRoute requiredRole="VOTER">
            <VotingPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/results/:electionId" 
        element={
          <PrivateRoute requiredRole="VOTER">
            <ElectionResults />
          </PrivateRoute>
        } 
      />

      {/* Admin routes */}
      <Route 
        path="/admin-elections" 
        element={
          <PrivateRoute requiredRole="ADMIN">
            <AdminElections />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/create-election" 
        element={
          <PrivateRoute requiredRole="ADMIN">
            <CreateElection />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/admin-election-detail/:electionId" 
        element={
          <PrivateRoute requiredRole="ADMIN">
            <AdminElectionDetail />
          </PrivateRoute>
        } 
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

