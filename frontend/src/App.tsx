import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import LoginPage from './features/Login';
import Dashboard from './components/Dashboard';
import TextEditor from './components/TextEditor';
import InitRoute from './components/InitRoute';
import NotFound from './components/NotFound';
import RegisterPage from './features/Register';
import AcceptInvitation from './features/AcceptInvitation';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<InitRoute />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents/:id"
              element={
                <ProtectedRoute>
                  <TextEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/accept-invite"
              element={
                <ProtectedRoute>
                  <AcceptInvitation />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
};

export default App;
