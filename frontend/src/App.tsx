import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TOFDashboard from './pages/TOFDashboard';
import MOFDashboard from './pages/MOFDashboard';
import BOFDashboard from './pages/BOFDashboard';
import AudienceInsightsDashboard from './pages/AudienceInsightsDashboard';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tof" element={<TOFDashboard />} />
          <Route path="/mof" element={<MOFDashboard />} />
          <Route path="/bof" element={<BOFDashboard />} />
          <Route path="/audience" element={<AudienceInsightsDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
