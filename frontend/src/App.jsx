// App.jsx - FIXED VERSION - Navbar shows on HomePage

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DoctorAuthProvider, useDoctorAuth } from './context/DoctorAuthContext';

// Page imports
import HomePage from './pages/HomePage';
import AssessmentFormPage from './pages/AssessmentFormPage';
import DashboardPage from './pages/DashboardPage';
import TestPage from './pages/TestPage';
import ResultsPage from './pages/ResultsPage';
import BabyHistoryPage from './pages/BabyHistoryPage';
import ClinicalLandingPage from './pages/ClinicalLandingPage';
import PrescriptionFormPage from './pages/PrescriptionFormPage';
import PrescriptionViewPage from './pages/PrescriptionViewPage';
import ProfilePage from './pages/ProfilePage';
import DoctorNavbar from './components/DoctorNavbar';

// ✅ PROTECTED ROUTE COMPONENT
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useDoctorAuth();
  
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
  
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

// ✅ MAIN APP ROUTES WITH CONDITIONAL NAVBAR
function AppContent() {
  const location = useLocation();
  const { isAuthenticated } = useDoctorAuth();
  
  // ✅ FIXED: Show navbar on all authenticated pages (including HomePage)
  // Only hide navbar on landing page and test page
  const shouldShowNavbar = isAuthenticated() && 
    location.pathname !== '/' && 
    location.pathname !== '/test';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {shouldShowNavbar && <DoctorNavbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<ClinicalLandingPage />} />
        <Route path="/test" element={<TestPage />} />
        
        {/* ✅ PROTECTED ROUTES */}
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
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to={isAuthenticated() ? "/HomePage" : "/"} replace />} />
      </Routes>
    </div>
  );
}

// ✅ MAIN APP COMPONENT
function App() {
  return (
    <DoctorAuthProvider>
      <Router>
        <AppContent />
      </Router>
    </DoctorAuthProvider>
  );
}

export default App;