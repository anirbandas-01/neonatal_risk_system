import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage';
import AssessmentFormPage from './pages/AssessmentFormPage';
import DashboardPage from './pages/DashboardPage';
import TestPage from './pages/TestPage';
import ResultsPage from './pages/ResultsPage';
import BabyHistoryPage from './pages/BabyHistoryPage';
import ClinicalLandingPage from './pages/ClinicalLandingPage';
import PrescriptionFormPage from './pages/PrescriptionFormPage';
import PrescriptionViewPage from './pages/PrescriptionViewPage';


function App() {
   return (
<Router>
      <Routes>
        <Route path="/" element={<ClinicalLandingPage />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/assessment" element={<AssessmentFormPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path='/results' element={<ResultsPage  />}/>
        <Route path="/baby/:babyId/history" element={<BabyHistoryPage />} />
        <Route path='/prescription/create/:assessmentId' element={<PrescriptionFormPage />}/>
        <Route path='/prescription/:prescriptionId/view' element={<PrescriptionViewPage />}/>
      </Routes>
    </Router>
  );
}

export default App;
