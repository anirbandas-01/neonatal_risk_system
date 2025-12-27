import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage';
import AssessmentFormPage from './pages/AssessmentFormPage';
import DashboardPage from './pages/DashboardPage';
import TestPage from './pages/TestPage';
import ResultsPage from './pages/ResultsPage';
import BabyHistoryPage from './pages/BabyHistoryPage';
import ClinicalLandingPage from './pages/ClinicalLandingPage';


function App() {
   return (
<Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ClinicalLandingPage" element={<ClinicalLandingPage />} />
        <Route path="/assessment" element={<AssessmentFormPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path='/results' element={<ResultsPage  />}/>
        <Route path="/baby/:babyId/history" element={<BabyHistoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
