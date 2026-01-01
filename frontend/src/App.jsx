// frontend/src/App.jsx - FINAL VERSION WITH AUTH
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DoctorAuthProvider, useDoctorAuth } from './context/DoctorAuthContext';

import HomePage from './pages/HomePage';
import AssessmentFormPage from './pages/AssessmentFormPage';
import DashboardPage from './pages/DashboardPage';
import TestPage from './pages/TestPage';
import ResultsPage from './pages/ResultsPage';
import BabyHistoryPage from './pages/BabyHistoryPage';
import ClinicalLandingPage from './pages/ClinicalLandingPage';
import PrescriptionFormPage from './pages/PrescriptionFormPage';
import PrescriptionViewPage from './pages/PrescriptionViewPage';

// ✅ PROTECTED ROUTE COMPONENT
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useDoctorAuth();
  
  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to landing page if not authenticated
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

// ✅ APP ROUTES COMPONENT (inside auth provider)
function AppRoutes() {
  return (
    <Routes>
      {/* Public Route - Landing Page */}
      <Route path="/" element={<ClinicalLandingPage />} />
      
      {/* Test page (public for development) */}
      <Route path="/test" element={<TestPage />} />
      
      {/* ✅ PROTECTED ROUTES - Require Authentication */}
      <Route path="/HomePage" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      } />
      
      <Route path="/assessment" element={
        <ProtectedRoute>
          <AssessmentFormPage />
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      
      <Route path="/results" element={
        <ProtectedRoute>
          <ResultsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/baby/:babyId/history" element={
        <ProtectedRoute>
          <BabyHistoryPage />
        </ProtectedRoute>
      } />
      
      <Route path="/prescription/create/:assessmentId" element={
        <ProtectedRoute>
          <PrescriptionFormPage />
        </ProtectedRoute>
      } />
      
      <Route path="/prescription/:prescriptionId/view" element={
        <ProtectedRoute>
          <PrescriptionViewPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

// ✅ MAIN APP COMPONENT
function App() {
  return (
    <DoctorAuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </DoctorAuthProvider>
  );
}

export default App;