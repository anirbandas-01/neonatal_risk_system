import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage';
import AssessmentFormPage from './pages/AssessmentFormPage';
import DashboardPage from './pages/DashboardPage';
import TestPage from './pages/TestPage';
import ResultsPage from './pages/ResultsPage';


function App() {
   return (
<Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/assessment" element={<AssessmentFormPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path='/results' element={<ResultsPage  />}/>
      </Routes>
    </Router>
  );
}

export default App
