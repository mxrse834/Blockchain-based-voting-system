import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VoterElections from './pages/VoterElections';
import VotingPage from './pages/VotingPage';
import ElectionResults from './pages/ElectionResults';
import AdminElections from './pages/AdminElections';
import CreateElection from './pages/CreateElection';
import AdminElectionDetail from './pages/AdminElectionDetail';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="app-main">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Voter Routes */}
              <Route
                path="/voter/elections"
                element={
                  <ProtectedRoute>
                    <VoterElections />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/voter/elections/:electionId/vote"
                element={
                  <ProtectedRoute>
                    <VotingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/voter/elections/:electionId/results"
                element={
                  <ProtectedRoute>
                    <ElectionResults />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/elections"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminElections />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/create-election"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <CreateElection />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/elections/:electionId"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminElectionDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/elections/:electionId/results"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <ElectionResults />
                  </ProtectedRoute>
                }
              />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
